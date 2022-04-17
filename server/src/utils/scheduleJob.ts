
import { scheduleJob } from 'node-schedule';
import movieService from '../services/movie.service';

import seriesService from '../services/series.service';
import logger from './logger';

function updateSeriesStatus(): void {

    // Run every 2 days
    scheduleJob('0 0 2 * *', async () => {
        logger.info('UPDATING SERIES STATUS')

        try {
            await seriesService.updateSeriesStatus();
            logger.info('SERIES STATUS UPDATED!')
        } catch (error: any) {
            logger.error(error.message, 'updateSeriesStatus');
        }
    })

}

function getNewSeries(): void {

    // Run every day at 01:30 AM
    scheduleJob('30 1 * * *', async () => {

        logger.info('GETTING NEW SERIES')

        try {
            await seriesService.updateList();
            logger.info('SERIES LIST UPDATED!')
        } catch (error: any) {
            logger.error(error.message, 'getNewSeries');
        }
    })

}

function getNewMovies(): void {

    // Run every day at 01:10 AM
    scheduleJob('10 1 * * *', async () => {

        logger.info('GETTING NEW MOVIES')

        try {
            await movieService.updateList();
            logger.info('MOVIES LIST UPDATED!')
        } catch (error: any) {
            logger.error(error.message, 'getNewMovies');
        }
    })

}

const startScheduleJob = () => {
    updateSeriesStatus();
    getNewSeries();
    getNewMovies()
}

export default startScheduleJob