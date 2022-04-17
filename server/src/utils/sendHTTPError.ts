import { Response } from 'express';

function sendHttpError(error: Object | string, res: Response, code = 500): Response {
    const data = {
        data: null,
        error
    }

    return res.status(code).send(data)
}

export default sendHttpError