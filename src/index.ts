/* eslint-disable no-plusplus */
import express from 'express';
import config, { appConfig } from './config';
import initLogger from './config/logger';

// create express app
const app = express();
// initialize logger
const winstonLogger = initLogger(config.NODE_ENV);
// sets logger as a global variable
global.logger = winstonLogger;

appConfig(app);

export default app;
