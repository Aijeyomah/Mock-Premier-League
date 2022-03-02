
/* eslint-disable no-plusplus */
import db from './db';
import express from 'express';
import config, { appConfig } from './config';

// create express app
const app = express();
// initialize logger

db()
appConfig(app);

export default app;
