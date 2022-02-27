import { db } from './setup/mongo';
import { redisDB, cloneRedisDB } from './setup/redis';

export {
  db as default,
  redisDB,
  cloneRedisDB
};
