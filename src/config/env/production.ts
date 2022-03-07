import 'dotenv/config';

const production = {
    DATABASE_URL: process.env.MOCK_PREMIER_LEAGUE_MONGO_DEV_URL,
    REDIS_URL: process.env.REDIS_URL,
    SECRET: process.env.MOCK_PREMIER_LEAGUE_SECRET
};

export default production;
