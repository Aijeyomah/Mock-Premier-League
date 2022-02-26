import config from '../../config/env';

const {
  NODE_ENV,
  PORT
} = config;

// const BASE_URL = NODE_ENV === 'production'
//   ? MOCK_PREMIER_LEAGUE
//   : `http://localhost:${PORT || 3500}`;


  const BASE_URL = `http://localhost:${PORT || 3500}`;
export default {
  BASE_URL,
  v1: '/api/v1',
};
