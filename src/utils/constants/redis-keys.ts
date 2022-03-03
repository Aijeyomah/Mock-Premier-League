export default {
    REDIS_KEYS: {
      singleFixture: (fixtureId) => `store:${fixtureId}:id`,
    }
}