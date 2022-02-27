import * as redis from 'redis';
import { promisifyAll } from 'bluebird';
import config from '../../config/env';

// promisfies redis to enable the use of ES6 promises features.
promisifyAll(redis);

const { NODE_ENV, REDIS_URL } = config;


// Creates an instance of a Redis client.

const redisDB = redis.createClient();

// Selects a different database while in the testing environment
if (NODE_ENV === 'test') {
  redisDB.select(3)
    .then(async () => {
      try {
        await redisDB.flushDb();
      } catch (e) {
        logger.error(`An Error occurred while removing test keys with the message: ${e.message}`);
      }
    })
    .catch((e) => {
      logger.error(`An Error occurred while spawning a 
      new Redis database with the following message: ${e.message}`);
      process.exit(1);
    })
}

// Spawns a new redis connection instance that holds
// the same configuration as the client above with an option to change configurations.
const cloneRedisDB = (options = {}) => redisDB.duplicate(options,);

export {
  redisDB, cloneRedisDB
};




