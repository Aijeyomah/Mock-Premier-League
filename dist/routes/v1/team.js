"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const teams_1 = require("./../../validations/teams");
const teams_2 = require("./../../controllers/teams");
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const role_1 = __importDefault(require("../../middleware/auth/role"));
const teams_3 = __importDefault(require("../../middleware/team/teams"));
const { authenticate } = auth_1.AuthMiddleware;
const { roleAccessValidator } = role_1.default;
const { validateAddTeam, validateParams } = teams_3.default;
const router = (0, express_1.Router)();
router.post('', authenticate, roleAccessValidator(['Admin']), validateAddTeam, teams_2.addMembersToTeam);
router.delete('/:teamId', authenticate, roleAccessValidator(['Admin']), validateParams(teams_1.idParam), teams_2.removeTeam);
router.put('/:teamId', authenticate, roleAccessValidator(['Admin']), validateParams(teams_1.idParam), validateAddTeam, teams_2.editTeam);
router.get('/all', authenticate, roleAccessValidator(['Admin']), teams_2.getAllTeams);
router.get('/:teamId', authenticate, roleAccessValidator(['Admin']), validateParams(teams_1.idParam), teams_2.getTeam);
exports.default = router;
//# sourceMappingURL=team.js.map