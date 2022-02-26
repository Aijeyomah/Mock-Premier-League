/* eslint-disable no-unused-vars */
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiV1Routes from '../routes/v1';
import config from './env';
import { constants, genericErrors, Helper } from '../utils';

const { errorResponse, successResponse } = Helper;
const { notFoundApi } = genericErrors;
const {
  WELCOME,
  v1,
  JETT_RUNNING,
} = constants;

const appConfig = (app) => {
  // integrate winston logger with morgan
  app.use(morgan('combined', { stream: logger.stream }));
  // adds security middleware to handle potential attacks from HTTP requests
  app.use(helmet());
  // adds middleware for cross-origin resource sharing configuration
  app.use(cors());
  app.use(json());
  // adds middleware that parses requests with x-www-form-urlencoded data encoding
  app.use(urlencoded({ extended: true }));
  // adds a heartbeat route for the culture
  app.get('/', (req, res) => successResponse(res, { message: WELCOME }));
  
  // serves v1 api routes
  app.use(v1, apiV1Routes);
  // catches 404 errors and forwards them to error handlers
  app.use((req, res, next) => {
    next(notFoundApi);
  });
  // handles all forwarded errors
  app.use((err, req, res, next) => errorResponse(req, res, err));
  const port = config.PORT || 3500;
  app.listen(port, () => {
    logger.info(`${JETT_RUNNING} ${port}`);
  });
};

export default appConfig;
