import MovieModel from "../models/movie.model";
import logger from "./logger";

(async function () {

    const movies = await MovieModel.find();

    logger.info(movies);

    for (const movie of movies) {
        const now = Date.now();
        await MovieModel.updateOne({ slug: movie.slug }, { sorter: now });
        logger.info(movie.title);
    }

    logger.info("DONE!");

})()