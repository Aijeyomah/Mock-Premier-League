"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fixtures_1 = require("./../../validations/fixtures");
const fixtures_2 = require("./../../controllers/fixtures");
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const role_1 = __importDefault(require("../../middleware/auth/role"));
const teams_1 = __importDefault(require("../../middleware/team/teams"));
const { authenticate } = auth_1.AuthMiddleware;
const { roleAccessValidator } = role_1.default;
const { validateParams } = teams_1.default;
const router = (0, express_1.Router)();
router.post('', authenticate, roleAccessValidator('Admin'), fixtures_2.createFixture);
router.delete('/:fixtureId', authenticate, roleAccessValidator(['Admin']), validateParams(fixtures_1.fixtureId), fixtures_2.deleteFixture);
router.put('/:fixtureId', authenticate, roleAccessValidator(['Admin']), validateParams(fixtures_1.fixtureId), fixtures_2.updateFixture);
router.get('/completed', authenticate, fixtures_2.fetchCompletedFixtures);
router.get('/pending', authenticate, fixtures_2.fetchPendingFixture);
router.get('/search', fixtures_2.searchFixture);
router.get('/all', authenticate, fixtures_2.viewAllFixture);
router.get('/:fixtureId', authenticate, validateParams(fixtures_1.fixtureId), fixtures_2.viewSingleFixture);
exports.default = router;
//# sourceMappingURL=fixtures.js.map