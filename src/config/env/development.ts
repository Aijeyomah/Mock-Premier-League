import 'dotenv/config';

const development = {
    DATABASE_URL: process.env.MOCK_PREMIER_LEAGUE_MONGO_DEV_URL,
    REDIS_URL: process.env.REDIS_URL,
    SECRET: process.env.MOCK_PREMIER_LEAGUE_SECRET
}


export default development;

