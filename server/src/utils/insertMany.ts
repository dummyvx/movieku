import { writeFileSync, readFileSync } from 'fs';

import MovieModel, { Movie } from '../models/movie.model';
import SeriesModel, { Series } from '../models/series.model';
import logger from './logger';

export type LabelData = 'movies' | 'series'

export const overrideOptions = (label: LabelData, newData: any) => {
    const prevOptions = JSON.parse(readFileSync('./options.json').toString());
    writeFileSync('./options.json', JSON.stringify({ ...prevOptions, [label]: { lastStopped: { ...prevOptions[label].lastStopped, ...newData } } }));
}

async function insertMany(label: LabelData, input: Array<Series | Movie>, atPage?: number): Promise<{ error: string | undefined }> {

    let lastData: { page: number; index: number } | undefined = undefined

    switch (label) {
        case 'series':
            try {
                let index = 0
                for await (const series of input) {
                    index++

                    const existedMovie = await SeriesModel.findOne({ slug: series.slug }).lean();
                    if (!existedMovie) {
                        logger.info(`INSERTING: ${series.title}`);

                        if (atPage) lastData = { page: atPage, index }
                        await SeriesModel.create(series);
                    } else {
                        await SeriesModel.updateOne({ slug: existedMovie.slug }, series);
                    }

                    overrideOptions('series', { page: 0, index: 0 })
                    index = 0
                }

                return {
                    error: undefined
                }
            } catch (error: any) {
                logger.error(error.message);
                if (lastData) {
                    overrideOptions('series', lastData);
                }
                return { error: error.message }
            }

        default:
            try {
                let index = 0
                for await (const movie of input) {
                    index++

                    const existedMovie = await MovieModel.findOne({ title: movie.title, slug: movie.slug }).lean();
                    if (!existedMovie) {
                        logger.info(`INSERTING: ${movie.title}`);

                        if (atPage) lastData = { page: atPage, index }
                        await MovieModel.create(movie);
                    } else {
                        await MovieModel.updateOne({ slug: existedMovie.slug }, movie);
                    }

                    overrideOptions('movies', { page: 0, index: 0 })
                    index = 0
                }

                return {
                    error: undefined
                }
            } catch (error: any) {
                logger.error(error.message);
                if (lastData) {
                    overrideOptions('series', lastData);
                }
                return { error: error.message }
            }
    }

}

export default insertMany