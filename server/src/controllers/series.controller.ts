import { Request, Response } from 'express';
import seriesService, { GetAllSeriesParams } from '../services/series.service';
import logger from '../utils/logger';
import sendHttpError from '../utils/sendHTTPError';


type GetAllSeriesType = {
    page?: string;
    based?: "trending" | "newest";
    limit?: string;
}

const paginateData = async (req: Request, res: Response, queries: any, limit: number, currentPage: number, sort: GetAllSeriesParams['sort']) => {
    const BASE_URL = process.env.BASE_URL!

    const countAllPost = await seriesService.countAllData(queries);

    // Posts -> 
    // 98    -> 98 / 10 =  floor(9.8) = 9 <= 
    // 98 % 10 !== 0 then still there is a left post, then allPage + 1

    const isModulo = countAllPost % limit === 0
    const allPage = isModulo ? Math.floor(countAllPost / limit) : (Math.floor(countAllPost / limit) + 1);

    if ((currentPage - 1) < 1) {
        currentPage = 1
    }

    // 1 - 1 =             0
    // 2 - 1 = (1 * 10) -> 10
    // 3 - 1 = (2 * 10) -> 20
    // 4 - 1 = (3 * 10) -> 30
    const skip = (currentPage - 1) * limit

    const series = await seriesService.getAll({ query: queries, sort, limit, skip });
    if (typeof series === 'string') {
        const data = {
            data: null,
            error: series
        }

        return res.status(404).send(data);
    }

    const query = req.url.split('&')[1]

    const nextURL = `${BASE_URL}api/v1/series?page=${currentPage + 1}${query ? `&${query}` : ''}`;
    const nextUrl = currentPage >= allPage ? null : nextURL;

    const response = {
        data: series,
        info: {
            page: currentPage,
            nextURL: nextUrl,
            allPage
        },
        error: null
    }

    return res.send(response);
}

export const getAllSeries = async (req: Request<{}, {}, {}, GetAllSeriesType>, res: Response): Promise<Response> => {

    const queryBased = req.query.based;
    if (!queryBased) req.query.based = "newest";
    if (queryBased !== "trending" && queryBased !== "newest") req.query.based = "newest"

    const page = req.query.page
    let currentPage = page ? Number(page) : 1
    const limit = req.query.limit ? Number(req.query.limit) : 10

    try {

        const { page: _page, based: _based, ...queries } = req.query

        switch (req.query.based) {
            case "newest":
                return await paginateData(req, res, queries, limit, currentPage, { sorter: 1 })

            case "trending":
                return await paginateData(req, res, queries, limit, currentPage, { rating: -1 })

            default:
                return sendHttpError({
                    message: "Invalid queries. Please provide based queries",
                    example: {
                        based: "newest"
                    }
                }, res, 406);

        }

    } catch (error: any) {
        logger.error({ error: error.message });
        return sendHttpError(error.message, res);
    }

}

export const scrapAllSeries = async (req: Request, res: Response): Promise<Response> => {

    const isEmptyObject = Object.entries(req.query).length < 1
    if (!isEmptyObject) {
        return await scrapSeriesWithRange(req, res);
    }

    try {

        const series = await seriesService.scrapAll();
        if (typeof series === 'string') {
            const data = {
                data: null,
                error: series
            }

            return res.status(404).send(data);
        }

        const data = {
            data: series,
            error: null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message });
        return sendHttpError(error.message, res);
    }
}

export const scrapSeriesWithRange = async (req: Request, res: Response): Promise<Response> => {

    const { startFrom, endAt } = req.query
    if (!(startFrom && endAt)) {
        return sendHttpError({
            message: "Invalid queries. Please provide startFrom & endAt",
            example: {
                startFrom: 5,
                endAt: 6
            }
        }, res, 406);
    }

    if (Number(endAt) < Number(startFrom)) {
        return sendHttpError({
            message: "Invalid queries. endAt must be greater than startFrom",
            example: {
                startFrom: 5,
                endAt: 6
            }
        }, res, 406);
    }

    try {

        const series = await seriesService.scrapWithRange(Number(startFrom), Number(endAt));
        if (typeof series === 'string') {
            const data = {
                data: null,
                error: series
            }

            return res.status(404).send(data);
        }

        const data = {
            data: series,
            error: null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message });
        return sendHttpError(error.message, res);
    }
}

export const updateSeriesList = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const newSeries = await seriesService.updateList();
        if (typeof newSeries === 'string') {
            const data = {
                data: null,
                error: newSeries
            }

            return res.status(404).send(data);
        }

        const data = {
            data: newSeries,
            error: null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message });
        return sendHttpError(error.message, res);
    }
}

export const getSeriesByQueries = async (req: Request, res: Response): Promise<Response> => {

    const query = req.query
    if (Object.entries(query).length < 1) {
        return sendHttpError({
            message: "Invalid queries. Please provide any queries",
            example: {
                country: 'KR',
                genres: 'action',
                quality: 'bluray'
            }
        }, res, 406);
    }

    try {

        const series = await seriesService.getSeriesByQuery(query);
        if (typeof series === 'string') {
            const data = {
                data: null,
                error: series
            }

            return res.status(404).send(data);
        }

        const data = {
            data: series,
            error: null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message });
        return sendHttpError(error.message, res);
    }
}

export const updateSeriesStatus = async (_req: Request, res: Response): Promise<Response> => {

    try {

        const series = await seriesService.updateSeriesStatus();
        if (typeof series === 'string') {
            const data = {
                data: null,
                error: series
            }

            return res.status(404).send(data);
        }

        const data = {
            data: series,
            error: null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message });
        return sendHttpError(error.message, res);
    }

}

export const searchSeries = async (req: Request, res: Response): Promise<Response> => {

    if (!Object.entries(req.query).length) {
        return sendHttpError({
            message: "Invalid queries. Please provide the query",
            example: {
                q: "love",
            }
        }, res, 406);
    }

    const { q } = req.query

    try {

        const series = await seriesService.searchSeries(q as string);

        const data = {
            data: series,
            error: null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message }, 'router.controller.search')
        return sendHttpError(error.message, res);
    }

}

export const getOneSeries = async (req: Request, res: Response): Promise<Response> => {

    const BASE_URL = process.env.BASE_URL!

    if (!req.params.slug) {
        return sendHttpError({
            message: "Invalid params. Please provide the params!",
            example: `${BASE_URL}/api/v1/series/tuning`
        }, res, 406);
    }

    try {

        const oneSeries = await seriesService.getOneSeries(req.params.slug);

        const data = {
            data: oneSeries,
            error: !oneSeries ? 'No series found!' : null
        }

        return res.send(data);

    } catch (error: any) {
        logger.error({ error: error.message }, 'router.controller.search')
        return sendHttpError(error.message, res);
    }
}