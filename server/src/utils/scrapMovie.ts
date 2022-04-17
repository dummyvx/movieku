import { Page } from "puppeteer";
import { FilterQuery } from 'mongoose';

import { Movie } from "../models/movie.model";
import logger from "./logger";

let pageResults: Array<Movie> = []

export type ScrapMovieResult = {
    pageResults: Array<Movie>;
    next: boolean;
}

const getEvaluate = async (page: Page): Promise<Movie> => {
    const result = await page.evaluate(() => {
        const slug = document.URL.split('7/')[1].split('/')[0]
        const title = (document.querySelector('.entry-title') as any)?.innerText as string
        const poster = (document.querySelector('.limage > img') as any)?.src as string
        const rating = (document.querySelector('.rtd > span') as any)?.innerText.split(': ')[1]
        const synopsis = (document.querySelectorAll('.entry-content > p')[1] as any)?.innerText as string
        const trailer = (document.querySelector('#trailer > .limit > iframe') as any)?.src as string

        const genres = (document.querySelectorAll('.data > li > .colspan')[0] as any)?.innerText.split(', ') as Array<string>
        const release = (document.querySelector('.data > li > .colspan > span > time') as any)?.innerText as string
        const stars = (document.querySelectorAll('.data > li > .colspan')[2] as any)?.innerText.split(', ') as Array<string>
        const duration = (document.querySelector('[property="duration"]') as any)?.innerText as string
        const director = (document.querySelector('[itemprop="director"] > span > a') as any)?.innerText as string
        const country = (document.querySelector('[itemprop="contentLocation"] > span > a') as any)?.innerText as string

        const dataLength = Array.from(document.querySelectorAll('.data > li')).length
        const quality = (document.querySelectorAll('.data > li > .colspan')[dataLength - 1] as any)?.innerText as string
        const links = Array.from(document.querySelectorAll('.smokeurl > p'), (item: any) => ({ quality: item.querySelector('strong') && item.querySelector('strong').innerText, links: Array.from(item.querySelectorAll('a'), (link: any) => ({ provider: link.innerText, src: link.href })) })).filter((item) => item.quality !== null)

        return { slug, title, poster, rating, synopsis, trailer, genres, release, stars, duration, director, country, quality, links }
    })

    return result
}

async function scrapMovie(page: Page, atPage: number, index: number = 0): Promise<ScrapMovieResult> {

    logger.info(`[MOVIES]: SCRAPPING PAGE ${atPage}`);

    await page.goto(`https://107.152.39.187/latest-movies/page/${atPage}/`, { waitUntil: 'domcontentloaded' });

    const isContains = await page.$('.notf');
    if (isContains) return {
        next: false,
        pageResults
    }

    const { allLinks, titles, next } = await page.evaluate(() => {
        return {
            allLinks: Array.from(document.querySelectorAll('.bx > a'), (item: any) => item.href as string),
            titles: Array.from(document.querySelectorAll('[itemprop="headline"]'), (item: any) => item.innerText as string),
            next: Boolean(document.querySelector('.next.page-numbers'))
        }
    })

    for (const link of allLinks) {

        logger.info(`[MOVIE PAGE]: ${atPage} [TITLE]: "${titles[index]}"`);
        await page.goto(link, { waitUntil: 'domcontentloaded' })

        const result = await getEvaluate(page);

        index++
        pageResults.push(result);
    }

    return {
        next, pageResults
    }

}

async function scrapMovieByQuery(page: Page, query: FilterQuery<Movie>): Promise<{ next: boolean; pageResults: Array<Movie> }> {

    await page.goto(`https://107.152.39.187/advanced-search/?order=popular&genre%5B%5D=${query.genres ?? 'action'}&${query.country ? `country%5B%5D=${query.country}` : ''}&type%5B%5D=post&quality%5B%5D=${query.quality ?? 'bluray'}`, { waitUntil: 'domcontentloaded' });
    const isNotEmpty = Boolean(await page.$('.latest > .los > article'));

    if (!isNotEmpty) return {
        next: false, pageResults: []
    }

    const { allLinks, titles, next, currentPage } = await page.evaluate(() => {
        return {
            allLinks: Array.from(document.querySelectorAll('.bx > a'), (item: any) => item.href as string),
            titles: Array.from(document.querySelectorAll('[itemprop="headline"]'), (item: any) => item.innerText as string),
            next: Boolean(document.querySelector('.next.page-numbers')),
            currentPage: document.querySelector('.page-numbers.current')?.textContent ?? 1
        }
    })

    let index = 0
    for (const link of allLinks) {

        logger.info(`[PAGE]: ${currentPage} [TITLE]: "${titles[index]}"`);
        await page.goto(link, { waitUntil: 'domcontentloaded' })

        const result = await getEvaluate(page);

        index++
        pageResults.push(result);
    }

    return {
        next, pageResults
    }

}


export {
    scrapMovieByQuery
}
export default scrapMovie