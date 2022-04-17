
import { scheduleJob } from 'node-schedule';

import seriesService from '../services/series.service';
import logger from './logger';

export default function jobs(): void {

    scheduleJob('0 0 * * 0', async () => {
        try {
            await seriesService.updateSeriesStatus();
        } catch (error: any) {
            logger.error(error.message, 'shcheduleJob.ts');
        }
    })

}