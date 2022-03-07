import config from '../../config/env';

const {
  NODE_ENV,
  PORT
} = config;
console.log(NODE_ENV);

const BASE_URL = NODE_ENV === 'production'
  ? process.env.MOCK_PREMIER_LEAGUE
  : `http://localhost:${PORT || 3500}`;

export default {
  BASE_URL,
  v1: '/api/v1',
};
