// Init dotenv to get environment variables before everything else
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DatabaseClient from './class/database';

const expressApp = express();
const PORT = process.env.port ?? 8080;

expressApp.use(
    cors({
        credentials: true,
        origin: '*',
    }),
);
expressApp.use(cookieParser());

expressApp.listen(PORT, () => {
    DatabaseClient.getDatabaseInstance();
    console.info(`App listening on port ${PORT}`);
});
