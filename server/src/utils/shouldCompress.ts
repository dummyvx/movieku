
import { Request, Response } from 'express';
import compression from 'compression';

const shouldCompress = (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) return false;

    return compression.filter(req, res);
}

export default shouldCompress