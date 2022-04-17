import { Page } from 'puppeteer';
import { Movie } from './models/movie.model';
import { Series } from './models/series.model';

import logger from './utils/logger';
import setupBrowser from './utils/setupBrowser';

(async function () {

    const { page } = await setupBrowser();

})()