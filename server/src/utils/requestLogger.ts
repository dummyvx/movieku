import { NextFunction, Request, Response } from 'express';
import logger from './logger';

const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`[TYPE]: "REQUEST" [METHOD]: "${req.method}" [ENDPOINT]: "${req.url}"`);
    if (req.url !== '/favicon.ico') res.on('finish', () => logger.info(`[TYPE]: "RESPONSE" [METHOD]: "${req.method}" [CODE]: "${res.statusCode}" [ENDPOINT]: "${res.req.url}" `));

    return next()
}

export default requestLogger