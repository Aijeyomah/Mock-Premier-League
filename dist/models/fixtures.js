"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureModel = void 0;
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = require("mongoose");
const team = {
    ref: 'TeamModel',
    type: Array,
    name: {
        type: String,
        enum: ['AFC Bournemouth', 'Arsenal', 'Aston Villa', 'Brighton & Hove Albion', 'Burnley', 'Chelsea',
            'Crystal Palace', 'Everton', 'Leicester City', 'Liverpool', 'Manchester City', 'Manchester United',
            'Newcastle United', ' Norwich City', 'Sheffield United', 'Southampton', 'Tottenham Hotspur', 'Watford',
            'West Ham United', 'Wolverhampton Wanderers', 'Barcalona', 'wolves']
    },
    score: { type: Number, default: 0 }
};
const teamFixtureSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    firstTeam: team,
    secondTeam: team,
    status: { type: String, default: 'pending' },
    matchInfo: {
        type: Array,
        date: Date,
        stadium: {
            type: String,
            enum: ['Vitality Stadium', 'The Amex', 'Turf Moor', 'Cardiff City Stadium',
                "John Smith's Stadium", 'King Power Stadium', 'Goodison Park', 'Anfield',
                'Emirates Stadium', 'Stamford Bridge', 'Selhurst Park', 'Craven Cottage',
                'Wembley Stadium', 'London Stadium', 'Etihad Stadium', 'Old Trafford',
                'St James Park', "St Mary's Stadium", 'Vicarage Road', 'Molineux Stadium']
        }
    },
    createdAt: { type: Date, default: (0, moment_1.default)(Date.now()).format('LLLL') },
    updatedAt: { type: Date, default: (0, moment_1.default)(Date.now()).format('LLLL') },
});
exports.FixtureModel = (0, mongoose_1.model)("Fixtures", teamFixtureSchema);
//# sourceMappingURL=fixtures.js.map