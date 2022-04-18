import { Router } from 'express';
import { scrapAllMovies, getMovieByQueries, scrapNewMovies, getAllMovies, searchMovies, getMovie } from '../../controllers/movie.controller';

const router = Router()

router.get('/', getAllMovies);

router.get('/:slug/one', getMovie);

router.get('/scrap', scrapAllMovies);

router.put('/scrap/update', scrapNewMovies);

router.get('/filter', getMovieByQueries);

router.get('/search', searchMovies);

export default router