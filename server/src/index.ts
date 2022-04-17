import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import v1 from './routes/v1';
import logger from './utils/logger';
import requestLogger from './utils/requestLogger';
import startScheduleJob from './utils/scheduleJob';

dotenv.config();

const PORT = process.env.PORT || 3001
const app = express();

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(requestLogger);

app.get('/', (_req, res) => res.sendStatus(200));
app.use('/api/v1', v1);

(async function () {

    try {
        let CONNECTION_URL = ''
        const MODE = process.env.NODE_ENV!
        const BASE_URL = process.env.BASE_URL!

        if (MODE !== 'production') {
            CONNECTION_URL = process.env.MONGODB_URL_TEST!
        } else {
            CONNECTION_URL = process.env.MONGODB_URL!
        }

        await mongoose.connect(CONNECTION_URL);
        logger.info(`🚀 DATABASE CONNECTED!`);

        startScheduleJob();
        app.listen(PORT, () => logger.info(`🚀 SERVER SERVING AT ${BASE_URL}`))
    } catch (error: any) {
        logger.error(error.message, 'Index.ts');
    }

})()