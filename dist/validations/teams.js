"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParam = exports.addTeamSchema = void 0;
const generic_1 = require("./generic");
const joi_1 = __importDefault(require("@hapi/joi"));
const validField = ['Goal Keeper', 'Central Back', 'Central Midfield', 'Central Forward', 'Left Wing', 'Attacking Midfield', 'Central Forward', 'Left Midfielder', 'Striker', 'Defending', 'Right Midfielder'];
const validTeamNames = ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea', 'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
    'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford', 'West Ham United', 'Wolverhampton Wanderers', 'wolves', 'Barcalona'];
const teamMembersArray = joi_1.default.object({
    name: (0, generic_1.textSchema)(joi_1.default, "role", 100, 2),
    role: joi_1.default.string()
        .trim()
        .valid(...validField)
        .required(),
});
exports.addTeamSchema = joi_1.default.object({
    teamName: joi_1.default.string()
        .trim()
        .valid(...validTeamNames)
        .required(),
    teamMembers: joi_1.default.array()
        .unique((a, b) => a.name === b.name)
        .items(teamMembersArray)
        .min(1)
        .required()
        .messages({
        'any.required': 'team members  is a required field',
        'string.empty': 'team members cannot be left empty',
        'array.min': 'team members must contain at least 2 items',
        'array.unique': 'team members can not contain duplicate name'
    }),
}).options({
    allowUnknown: true,
});
exports.idParam = joi_1.default.object().keys({
    teamId: joi_1.default.string()
        .required(),
});
//# sourceMappingURL=teams.js.map