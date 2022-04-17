import { Router } from 'express';

import Movie from './Movie';
import Series from './Series';

const router = Router()

router.use('/movie', Movie);
router.use('/series', Series);

export default router