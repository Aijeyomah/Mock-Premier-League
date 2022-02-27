import 'dotenv/config';

const development = {
    DATABASE_URL: process.env.MOCK_PREMIER_LEAGUE_MONGO_DEV_URL,
    REDIS_URL: process.env.EXPRESS_PHARMACY_REDIS_URL,
    SECRET: process.env.MOCK_PREMIER_LEAGUE_SECRET
}


export default development;

