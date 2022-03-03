"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamModel = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const teamSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    teamName: {
        type: String,
        unique: true,
        enum: ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
            'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
            'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford',
            'West Ham United', 'Wolverhampton Wanderers', 'Barcalona']
    },
    teamMembers: {
        name: {
            type: String, lowercase: true, required: true
        },
        role: {
            type: String,
            enum: ['Goal Keeper', 'Central Back', 'Central Midfield', 'Central Forward', 'Left Wing', 'Attacking Midfield', 'Central Forward', 'Left Midfielder', 'Striker', 'Defending', 'Right Midfielder'],
            required: true
        },
        type: Array
    },
    description: String,
    createdAt: { type: Date, default: (0, moment_1.default)(Date.now()).format('LLLL') },
    updatedAt: { type: Date, default: (0, moment_1.default)(Date.now()).format('LLLL') },
});
teamSchema.plugin(mongoose_unique_validator_1.default);
teamSchema.index({ 'teamMembers.0.name': 'text', description: 'text', _id: 'text' });
exports.TeamModel = (0, mongoose_1.model)("Team", teamSchema);
//# sourceMappingURL=teams.js.map