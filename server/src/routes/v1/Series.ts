import { Router } from 'express';
import { scrapAllSeries, getSeriesByQueries, updateSeriesList, updateSeriesStatus, getAllSeries, searchSeries, getOneSeries } from '../../controllers/series.controller';

const router = Router()

router.get('/', getAllSeries);

router.get('/:slug/one', getOneSeries);

router.get('/scrap', scrapAllSeries);

router.put('/scrap/update', updateSeriesList);

router.get('/filter', getSeriesByQueries);

router.put('/status', updateSeriesStatus);

router.get('/search', searchSeries);

export default router