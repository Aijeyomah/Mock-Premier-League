"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    REDIS_KEYS: {
        singleFixture: (fixtureId) => `store:${fixtureId}:id`,
        allFixturesKeys: 'all-fixtures',
        completedFixturesKeys: 'completed-fixtures',
        pendingFixturesKeys: 'pending-fixtures'
    }
};
//# sourceMappingURL=redis-keys.js.map