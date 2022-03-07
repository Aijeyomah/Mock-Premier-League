"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTeam = exports.getAllTeams = exports.getTeam = exports.editTeam = exports.removeTeam = exports.addMembersToTeam = void 0;
const logger_1 = require("./../config/logger");
const utils_1 = require("../utils");
const teams_1 = require("./../models/teams");
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const { errorResponse, successResponse } = utils_1.Helper;
const { SUCCESSFULLY_ADDED_TEAM, SUCCESSFULLY_REMOVED_TEAM, SUCCESSFULLY_FETCHED_ALL_TEAM, SUCCESSFULLY_UPDATED_TEAM, SUCCESSFULLY_FETCHED_TEAM } = utils_1.constants;
const addMembersToTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, teamMembers, description } = req.body;
    try {
        const newTeams = new teams_1.TeamModel({
            _id: new mongoose_1.default.Types.ObjectId(),
            teamName,
            teamMembers,
            description
        });
        const data = yield newTeams.save();
        return successResponse(res, {
            data,
            message: SUCCESSFULLY_ADDED_TEAM,
        });
    }
    catch (error) {
        const err = error.errors.teamName.name === 'ValidatorError'
            ? errorResponse(req, res, utils_1.genericErrors.duplicateTeamName)
            :
                errorResponse(req, res, utils_1.genericErrors.errorAddingTeam);
        return err;
    }
});
exports.addMembersToTeam = addMembersToTeam;
const removeTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamId } = req.params;
    try {
        const team = yield teams_1.TeamModel.findByIdAndDelete({ _id: teamId }).exec();
        if (!team) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        return successResponse(res, {
            message: SUCCESSFULLY_REMOVED_TEAM
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorRemovingTeam));
    }
});
exports.removeTeam = removeTeam;
const editTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamName, teamMembers, description } = req.body;
    try {
        const team = yield teams_1.TeamModel.findByIdAndUpdate({ _id: req.params.teamId }, {
            $set: {
                teamName,
                teamMembers,
                description,
                updatedAt: (0, moment_1.default)(Date.now()).format('LLLL')
            }
        }, { useFindAndModify: false })
            .exec();
        if (!team) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        return successResponse(res, {
            message: SUCCESSFULLY_UPDATED_TEAM,
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorEditingTeam));
    }
});
exports.editTeam = editTeam;
const getTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamId } = req.params;
    try {
        const team = yield teams_1.TeamModel.findById({ _id: teamId })
            .select('_id teamName teamMembers description createdAt updatedAt')
            .exec();
        if (!team) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        return successResponse(res, {
            data: team,
            message: SUCCESSFULLY_FETCHED_TEAM,
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingTeam));
    }
});
exports.getTeam = getTeam;
const getAllTeams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const skip = (page * limit) - limit;
        const teamPromise = yield teams_1.TeamModel.find({}).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = yield teams_1.TeamModel.count();
        const [allTeams, count] = yield Promise.all([teamPromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!allTeams.length && skip) {
            logger_1.logger.error('Could not fetch posts for user');
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        else {
            const data = { teams: allTeams, page, pages, count };
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_ALL_TEAM,
                data: data,
            });
        }
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingTeam));
    }
});
exports.getAllTeams = getAllTeams;
const searchTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, date, status, stadium, role } = req.body;
        const { query } = req;
        let { perPage } = query;
        const page = Number(query.page) || 1;
        const limit = 10 || Number(perPage);
        const skip = (page * limit) - limit;
        const fixturePromise = yield teams_1.TeamModel.find({
            $or: [
                { status },
                { role },
                { 'firstTeam.0.name': new RegExp(`^${name}$`, 'i') },
                { 'firstTeam.0.name': new RegExp(`^${name}$`, 'i') },
                { matchInfo: { $elemMatch: { date, stadium } } }
            ]
        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = yield teams_1.TeamModel.count();
        const [allFixtures, count] = yield Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        else {
            const data = { teams: allFixtures, page, pages, count };
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_ALL_TEAM,
                data: data,
                code: 201,
            });
        }
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingTeam));
    }
});
exports.searchTeam = searchTeam;
//# sourceMappingURL=teams.js.map