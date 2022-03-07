export default {
    REDIS_KEYS: {
      singleFixture: (fixtureId) => `store:${fixtureId}:id`,
      allFixturesKeys: 'all-fixtures',
      completedFixturesKeys: 'completed-fixtures',
      pendingFixturesKeys: 'pending-fixtures'
    }
}