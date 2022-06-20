import { Page } from "puppeteer";
import { FilterQuery } from 'mongoose';

import { Series } from "../models/series.model";
import logger from "./logger";

let pageResults: Array<Series> = []

const getEvaluate = async (page: Page): Promise<Series> => {
    const result = await page.evaluate(() => {
        const slug = document.URL.split('/series/')[1].split('/')[0]
        const title = (document.querySelector('.entry-title') as any)?.innerText as string
        const poster = (document.querySelector('.limage > img') as any)?.src as string
        const rating = (document.querySelector('.rtd > span') as any)?.innerText.split(': ')[1]

        const synopsis1 = document.querySelector('.intl-play-des')
        const synopsis2 = document.querySelectorAll('.entry-content > p')[1]
        const synopsis3 = document.querySelector('#synopsis > p')
        const synopsis4 = document.querySelector('.ipc-html-content.ipc-html-content--base')
        const synopsis5 = document.querySelector('.title-info-synopsis');
        const synopsis6 = document.querySelector('.desc > p');
        const synopsis7 = document.querySelector('.fotoanime > .sinopc');

        const synopsis = (
            synopsis1 ? synopsis1.textContent :
                synopsis2 ? synopsis2.textContent :
                    synopsis3 ? synopsis3.textContent :
                        synopsis4 ? synopsis4.textContent :
                            synopsis5 ? synopsis5.textContent :
                                synopsis6 ? synopsis6.textContent :
                                    synopsis7 ? synopsis7.textContent : '') as string

        let trailer = (document.querySelector('#trailer > .limit > iframe') as any | null)
        if (trailer) trailer = trailer.innerText

        const genres = (document.querySelectorAll('.data > li > .colspan')[0] as any)?.innerText.split(', ') as Array<string>
        const status = (document.querySelectorAll('.data > li > .colspan')[1] as any)?.innerText as string
        const release = (document.querySelector('.data > li > .colspan > span > time') as any)?.innerText as string
        const stars = (document.querySelectorAll('.data > li > .colspan')[3] as any)?.innerText.split(', ') as Array<string>
        const duration = (document.querySelector('[property="duration"]') as any)?.innerText as string
        const director = (document.querySelector('[itemprop="director"] > span > a') as any)?.innerText as string
        const country = (document.querySelector('[itemprop="contentLocation"] > span > a') as any)?.innerText as string

        const dataLength = Array.from(document.querySelectorAll('.data > li')).length
        const quality = (document.querySelectorAll('.data > li > .colspan')[dataLength - 1] as any)?.innerText as string

        const episode = Array.from(document.querySelectorAll('.smokeurl > h3'), (item: any) => item?.innerText as string);
        const link = Array.from(document.querySelectorAll('.smokeurl > p'), (item: any) => ({ quality: item.querySelector('strong') && item.querySelector('strong').innerText, links: Array.from(item.querySelectorAll('a'), (link: any) => ({ provider: link.innerText, src: link.href })) })).filter((item) => item.quality !== null)

        const links: any = episode.map((item, key) => ({
            episode: item, links: link.slice(4 * key, 4 * (key + 1))
        }))

        return { slug, title, poster, rating, synopsis, genres, release, stars, duration, country, quality, links, trailer, status, director }
    })

    const sorter = Date.now();

    return {
        ...result,
        sorter
    }
}

async function scrapSeries(page: Page, atPage: number, index: number = 0) {

    logger.info(`[SERIES]: SCRAPPING PAGE ${atPage}`);
    await page.goto(`https://107.152.39.187/series/page/${atPage}/`, { waitUntil: 'domcontentloaded' });
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

        logger.info(`[SERIES PAGE]: ${atPage} [TITLE]: ${titles[index]}`);
        await page.goto(link, { waitUntil: 'domcontentloaded' })

        const result = await getEvaluate(page);

        index++
        pageResults.push(result);
    }

    return {
        next, pageResults
    }

}

async function scrapOneSeries(page: Page, slug: string): Promise<Series | null> {

    let seriesData: Series | null = null

    logger.info(`[SERIES]: SCRAPPING A SERIES: ${slug}`);
    await page.goto(`https://107.152.39.187/series/${slug}/`, { waitUntil: 'domcontentloaded' });
    const isContains = await page.$('.notf');

    if (isContains) return seriesData

    const result = await getEvaluate(page);
    seriesData = result

    return seriesData

}

async function scrapSeriesByQuery(page: Page, query: FilterQuery<Series>) {

    await page.goto(`https://107.152.39.187/advanced-search/?order=popular&genre%5B%5D=${query.genres ?? 'action'}&${query.country ? `country%5B%5D=${query.country}` : ''}&type%5B%5D=series&quality%5B%5D=${query.quality ?? 'bluray'}`, { waitUntil: 'domcontentloaded' });
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
    scrapSeriesByQuery, scrapOneSeries
}
export default scrapSeries