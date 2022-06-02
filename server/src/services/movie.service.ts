import { FilterQuery } from 'mongoose';
import { Browser } from 'puppeteer';
import { readFileSync } from 'fs';

import scrapMovie, { scrapMovieByQuery } from '../utils/scrapMovie';
import logger from '../utils/logger';
import setupBrowser from '../utils/setupBrowser';
import insertMany, { overrideOptions } from '../utils/insertMany';

import MovieModel, { Movie } from '../models/movie.model';

async function countAllData(filterQuery?: FilterQuery<Movie>): Promise<number> {
    if (filterQuery) return await MovieModel.find(filterQuery).count()
    return MovieModel.count()
}

export type GetAllParams = {
    query?: FilterQuery<Movie>;
    sort?: Record<string, number>;
    limit: number;
    skip: number;
}
async function getAll({ query, sort, limit, skip }: GetAllParams): Promise<Array<Movie> | string> {

    try {

        if (query) {
            return MovieModel.find(query).limit(limit).skip(skip).sort(sort).lean();
        }

        return MovieModel.find().limit(limit).skip(skip).sort(sort).lean();

    } catch (error: any) {
        logger.error(error.message);
        return error.message
    }

}

async function scrapAll(): Promise<Array<Movie> | string> {

    let pageResults: Array<Movie> = []
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

        const { next, pageResults: results } = await scrapMovie(page, atPage);
        pageResults.push(...results);
        isNext = next

        while (isNext) {
            const { next, pageResults: results } = await scrapMovie(page, atPage);
            isNext = next
            pageResults.push(...results);
            atPage++

            if (prevPage !== atPage) {
                const { error } = await insertMany('movies', pageResults, prevPage);
                if (error) return error
                prevPage = atPage
            }
        }

        await browser.close();
        return pageResults

    } catch (error: any) {
        logger.error(error, 'getAllMovies');
        await browser.close()

        overrideOptions('movies', { page: prevPage, index: indexPage })
        return error.message
    }
}

async function scrapWithRange(startFrom: number, endAt: number): Promise<Array<Movie> | string> {

    let browser: Browser | undefined = undefined
    let pageResults: Array<Movie> = []

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

                await insertMany('movies', pageResults, prevPage);
                return pageResults
            }

            const { series: { lastStopped } } = JSON.parse(readFileSync('options.json').toString());

            if (atPage <= lastStopped.page) {
                atPage = lastStopped.page
                prevPage = atPage
                indexPage = lastStopped.index

                logger.info(`CONTINUING FROM CACHE: [PAGE]: ${atPage} [INDEX]: ${indexPage}`);
            }
            const { pageResults: results, next: isNext } = await scrapMovie(page, atPage, indexPage);
            next = isNext
            pageResults.push(...results);

            atPage++

            if (prevPage !== atPage) {
                logger.info(`INSERTING RESULTS FROM PAGE ${prevPage}`)
                const { error } = await insertMany('movies', pageResults, prevPage);
                if (error) return error
                prevPage = atPage
            }
        }

        await browser.close()

        await insertMany('movies', pageResults, prevPage);
        return pageResults
    } catch (error: any) {
        if (browser) await browser.close()

        overrideOptions('movies', { page: prevPage, index: indexPage })
        return error.message
    }

}

async function updateList(): Promise<Array<Movie> | { error: string }> {

    let browser: Browser | undefined = undefined

    try {
        const { page, browser: browserr } = await setupBrowser();
        browser = browserr

        const { pageResults: results } = await scrapMovie(page, 1);

        let newMovie: Array<Movie> = []

        for (const movie of results) {
            const existedMovie = await MovieModel.findOne({ title: movie.title });
            if (!existedMovie) {
                await MovieModel.create(movie);
                newMovie.push(movie);
            }
        }

        await browserr.close()
        return newMovie
    } catch (error: any) {
        if (browser) await browser.close()
        return error.message
    }

}

async function getMovieByQuery(query: FilterQuery<Movie>): Promise<Array<Movie> | { error: string }> {

    let browser: Browser | undefined = undefined

    try {
        let movies: Array<Movie> = []

        movies = await MovieModel.find(query).lean();
        if (movies.length) return movies

        const { page, browser: browserr } = await setupBrowser();
        browser = browserr

        let nextDump: boolean = true
        const { next, pageResults } = await scrapMovieByQuery(page, query);
        nextDump = next
        movies.push(...pageResults);

        while (nextDump) {
            const { next, pageResults: results } = await scrapMovieByQuery(page, query);
            nextDump = next
            movies.push(...results)
        }

        await browserr.close();

        await insertMany('movies', pageResults);
        return pageResults
    } catch (error: any) {
        if (browser) await browser.close()
        return error.message
    }

}

async function searchMovies(keyword: string): Promise<Array<Movie>> {
    return MovieModel.aggregate([
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

async function getMovie(slug: string): Promise<Movie | null> {
    return MovieModel.findOne({ slug }).lean();
}

export default {
    scrapAll, scrapWithRange, updateList,
    getMovieByQuery, countAllData, getAll,
    searchMovies, getMovie
}