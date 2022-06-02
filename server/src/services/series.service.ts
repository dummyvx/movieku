import { FilterQuery } from 'mongoose';
import { Browser } from 'puppeteer';
import { readFileSync } from 'fs';

import SeriesModel, { Series } from '../models/series.model';

import scrapSeries, { scrapOneSeries, scrapSeriesByQuery } from '../utils/scrapSeries';
import logger from '../utils/logger';
import insertMany, { overrideOptions } from '../utils/insertMany';
import setupBrowser from '../utils/setupBrowser';

async function countAllData(filterQuery?: FilterQuery<Series>): Promise<number> {
    if (filterQuery) return SeriesModel.find(filterQuery).count()
    return SeriesModel.count()
}

export type GetAllSeriesParams = {
    query?: FilterQuery<Series>;
    sort?: Record<string, number>;
    limit: number;
    skip: number;
}

async function getAll({ query, limit, skip, sort }: GetAllSeriesParams): Promise<Array<Series> | string> {

    try {

        if (query) {
            return SeriesModel.find(query).limit(limit).skip(skip).lean().sort(sort);
        }

        return SeriesModel.find().limit(limit).skip(skip).lean().sort(sort);

    } catch (error: any) {
        logger.error(error.message);
        return error.message
    }

}

async function scrapAll(): Promise<Array<Series> | string> {

    let pageResults: Array<Series> = []
    let atPage = 1
    let prevPage = atPage
    const { page, browser } = await setupBrowser();

    let isNext: boolean = false

    const { series: { lastStopped } } = JSON.parse(readFileSync('options.json').toString());

    let indexPage = 0
    if (atPage <= lastStopped.page) {
        atPage = lastStopped.page
        prevPage = atPage
        indexPage = lastStopped.index

        logger.info(`CONTINUING FROM CACHE: [PAGE]: ${atPage} [INDEX]: ${indexPage}`);
    }

    try {

        const { next, pageResults: results } = await scrapSeries(page, atPage);
        pageResults.push(...results);
        isNext = next

        while (isNext) {
            const { next, pageResults: results } = await scrapSeries(page, atPage);
            isNext = next
            pageResults.push(...results);
            atPage++

            if (prevPage !== atPage) {
                const { error } = await insertMany('series', pageResults, prevPage);
                if (error) return error
                prevPage = atPage
            }
        }

        await browser.close();
        return pageResults

    } catch (error: any) {
        logger.error(error, 'getAllSeries');
        await browser.close()

        overrideOptions('series', { page: prevPage, index: indexPage });
        return error.message
    }
}

async function scrapWithRange(startFrom: number, endAt: number): Promise<Array<Series> | string> {

    let browser: Browser | undefined = undefined
    let pageResults: Array<Series> = []

    const { page, browser: browserr } = await setupBrowser();
    browser = browserr

    let atPage = startFrom
    let prevPage = atPage
    let needNumbers = (endAt - startFrom) + 1
    let next = true

    let indexPage = 0

    try {

        for (let index = 0; index < needNumbers; index++) {
            if (!next) {
                await browser.close()

                await insertMany('series', pageResults, prevPage);
                return pageResults
            }

            const { series: { lastStopped } } = JSON.parse(readFileSync('options.json').toString());

            if (atPage <= lastStopped.page) {
                atPage = lastStopped.page
                prevPage = atPage
                indexPage = lastStopped.index

                logger.info(`CONTINUING FROM CACHE: [PAGE]: ${atPage} [INDEX]: ${indexPage}`);
            }
            const { pageResults: results, next: isNext } = await scrapSeries(page, atPage, indexPage);
            next = isNext
            pageResults.push(...results);

            atPage++

            if (prevPage !== atPage) {
                logger.info(`INSERTING RESULTS FROM PAGE ${prevPage}`)
                const { error } = await insertMany('series', pageResults, prevPage);
                if (error) return error
                prevPage = atPage
            }
        }

        await browser.close()

        await insertMany('series', pageResults, prevPage);
        return pageResults
    } catch (error: any) {
        if (browser) await browser.close()
        overrideOptions('series', { page: prevPage, index: indexPage });
        return error.message
    }

}

async function updateList(): Promise<Array<Series> | { error: string }> {

    let browser: Browser | undefined = undefined

    try {
        const { page, browser: browserr } = await setupBrowser();
        browser = browserr


        const { pageResults: results } = await scrapSeries(page, 1);

        let newMovie: Array<Series> = []

        for (const movie of results) {
            const existedMovie = await SeriesModel.findOne({ title: movie.title });
            if (!existedMovie) {
                await SeriesModel.create(movie);
                newMovie.push(movie);
            }
        }

        browserr.close()
        return newMovie
    } catch (error: any) {
        if (browser) await browser.close()
        return error.message
    }

}

async function getSeriesByQuery(query: FilterQuery<Series>): Promise<Array<Series> | { error: string }> {

    let browser: Browser | undefined = undefined

    try {
        let movies: Array<Series> = []

        movies = await SeriesModel.find(query).lean();
        if (movies.length) return movies

        const { page, browser: browserr } = await setupBrowser();
        browser = browserr

        let nextDump: boolean = true
        const { next, pageResults } = await scrapSeriesByQuery(page, query);
        nextDump = next
        movies.push(...pageResults);

        while (nextDump) {
            const { next, pageResults: results } = await scrapSeriesByQuery(page, query);
            nextDump = next
            movies.push(...results)
        }

        browserr.close();

        await insertMany('series', pageResults);
        return pageResults
    } catch (error: any) {
        if (browser) await browser.close()
        return error.message
    }

}

async function updateSeriesStatus(): Promise<Array<Series> | string> {

    let browserr: Browser | undefined = undefined

    try {

        const { page, browser } = await setupBrowser();
        browserr = browser

        logger.info('Getting Ongoing Series');
        const onGoingSeries = await SeriesModel.find({ status: 'Ongoing' }).lean()
        if (!onGoingSeries.length) return []

        let result: Array<Series> = []
        for (const { slug } of onGoingSeries) {
            const series = await scrapOneSeries(page, slug);
            if (series) {
                await SeriesModel.updateOne({ slug }, series);
                result = [...result, series]
            }
        }

        await browser.close();

        return result

    } catch (error: any) {
        if (browserr) await browserr.close();
        logger.error(error.message);
        return error.message
    }

}

async function getOneSeries(slug: string): Promise<Series | null> {
    return SeriesModel.findOne({ slug }).lean();
}

async function searchSeries(keyword: string): Promise<Array<Series>> {
    return SeriesModel.aggregate([
        {
            $search: {
                index: 'default',
                text: {
                    query: keyword,
                    path: ['title']
                },
                highlight: {
                    path: ['title']
                }
            },
        }
    ])
}

export default {
    scrapAll, scrapWithRange, updateList,
    getSeriesByQuery, updateSeriesStatus, countAllData,
    getAll, searchSeries, getOneSeries
}