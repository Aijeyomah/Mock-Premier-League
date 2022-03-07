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
exports.searchFixture = exports.fetchPendingFixture = exports.fetchCompletedFixtures = exports.viewAllFixture = exports.viewSingleFixture = exports.updateFixture = exports.deleteFixture = exports.createFixture = void 0;
const index_1 = require("../db/index");
const logger_1 = require("./../config/logger");
const fixtures_1 = require("./../models/fixtures");
const utils_1 = require("../utils");
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
const { errorResponse, successResponse, compareTwoTeams } = utils_1.Helper;
const { SUCCESSFULLY_ADDED_FIXTURE, SUCCESSFULLY_DELETED_FIXTURE, SUCCESSFULLY_UPDATED_FIXTURES, SUCCESSFULLY_FETCHED_FIXTURE, SUCCESSFULLY_FETCHED_FIXTURES, BASE_URL, REDIS_KEYS, SUCCESSFULLY_FETCHED_PENDING_FIXTURES, SUCCESSFULLY_FETCHED_COMPLETE_FIXTURES, } = utils_1.constants;
const { singleFixture, allFixturesKeys, completedFixturesKeys, pendingFixturesKeys } = REDIS_KEYS;
const createFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstTeam, secondTeam, matchInfo } = req.body;
    try {
        const fixture = new fixtures_1.FixtureModel({
            _id: new mongoose_1.default.Types.ObjectId(),
            firstTeam,
            secondTeam,
            matchInfo
        });
        const results = yield fixtures_1.FixtureModel.find({ firstTeam, secondTeam, matchInfo });
        if (results) {
            const pendingFixtures = results.filter(feature => feature.status === 'pending');
            if (pendingFixtures.length > 0) {
                return errorResponse(req, res, utils_1.genericErrors.duplicateFixtures);
            }
            const data = yield fixture.save();
            return successResponse(res, {
                data: { fixtureLink: `${BASE_URL}/api/v1/fixture/${data._id}`, data },
                message: SUCCESSFULLY_ADDED_FIXTURE,
            });
        }
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorAddingFixtures));
    }
});
exports.createFixture = createFixture;
const deleteFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fixtureId } = req.params;
    try {
        const fixture = yield fixtures_1.FixtureModel.findByIdAndDelete({
            _id: fixtureId
        }).exec();
        if (!fixture) {
            return errorResponse(req, res, utils_1.genericErrors.invalidFixture);
        }
        yield index_1.redisDB.del(singleFixture(fixtureId));
        logger_1.logger.info('deleted from cache');
        return successResponse(res, {
            message: SUCCESSFULLY_DELETED_FIXTURE,
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorDeletingFixture));
    }
});
exports.deleteFixture = deleteFixture;
const updateFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body, params } = req;
        const { firstTeam, secondTeam, matchInfo, status } = body;
        const { fixtureId } = params;
        yield index_1.redisDB.del(singleFixture(fixtureId));
        logger_1.logger.info('deleted from cache');
        const fixture = yield fixtures_1.FixtureModel.findByIdAndUpdate({ _id: fixtureId }, {
            $set: {
                firstTeam,
                secondTeam,
                matchInfo,
                status,
                updatedAt: (0, moment_1.default)(Date.now()).format('LLLL')
            }
        }, { useFindAndModify: false }).exec();
        if (!fixture) {
            return errorResponse(req, res, utils_1.genericErrors.invalidFixture);
        }
        return successResponse(res, {
            message: SUCCESSFULLY_UPDATED_FIXTURES,
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorUpdatingFixture));
    }
});
exports.updateFixture = updateFixture;
const viewSingleFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fixtureId } = req.params;
    try {
        const data = yield index_1.redisDB.get(singleFixture(fixtureId));
        if (data) {
            logger_1.logger.info('returning from cache...');
            return successResponse(res, {
                data: JSON.parse(data),
                message: SUCCESSFULLY_FETCHED_FIXTURE,
            });
        }
        const fixture = yield fixtures_1.FixtureModel.findById({ _id: fixtureId }).exec();
        if (!fixture) {
            return errorResponse(req, res, utils_1.genericErrors.invalidFixture);
        }
        yield index_1.redisDB.setEx(singleFixture(fixture._id), utils_1.constants['8HRS'], JSON.stringify(fixture));
        return successResponse(res, {
            data: fixture,
            message: SUCCESSFULLY_FETCHED_FIXTURE,
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingSingleFixture));
    }
});
exports.viewSingleFixture = viewSingleFixture;
const viewAllFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.redisDB.get(allFixturesKeys);
        if (result) {
            logger_1.logger.info('returning from cache');
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_FIXTURES,
                data: JSON.parse(result),
                code: 201,
            });
        }
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const skip = (page * limit) - limit;
        const fixturePromise = yield fixtures_1.FixtureModel.find({}).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = yield fixtures_1.FixtureModel.count();
        const [allFixtures, count] = yield Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        else {
            const data = { teams: allFixtures, page, pages, count };
            yield index_1.redisDB.setEx(allFixturesKeys, utils_1.constants['8HRS'], JSON.stringify(data));
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_FIXTURES,
                data: data,
                code: 201,
            });
        }
    }
    catch (error) {
        console.log(error);
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingAllFixture));
    }
});
exports.viewAllFixture = viewAllFixture;
const fetchCompletedFixtures = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.redisDB.get(completedFixturesKeys);
        if (result) {
            logger_1.logger.info('returning from cache');
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_COMPLETE_FIXTURES,
                data: JSON.parse(result),
                code: 201,
            });
        }
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const skip = (page * limit) - limit;
        const fixturePromise = yield fixtures_1.FixtureModel.find({
            status: "completed"
        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = yield fixtures_1.FixtureModel.count();
        const [allFixtures, count] = yield Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        const data = { teams: allFixtures, page, pages, count };
        yield index_1.redisDB.setEx(completedFixturesKeys, utils_1.constants['8HRS'], JSON.stringify(data));
        return successResponse(res, {
            message: SUCCESSFULLY_FETCHED_COMPLETE_FIXTURES,
            data: data,
            code: 201,
        });
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingAllFixture));
    }
});
exports.fetchCompletedFixtures = fetchCompletedFixtures;
const fetchPendingFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield index_1.redisDB.get(pendingFixturesKeys);
        if (result) {
            logger_1.logger.info('returning from cache');
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_PENDING_FIXTURES,
                data: JSON.parse(result),
                code: 201,
            });
        }
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const skip = (page * limit) - limit;
        const fixturePromise = yield fixtures_1.FixtureModel.find({
            status: "pending"
        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = yield fixtures_1.FixtureModel.count();
        const [allFixtures, count] = yield Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        else {
            const data = { teams: allFixtures, page, pages, count };
            yield index_1.redisDB.setEx(pendingFixturesKeys, utils_1.constants['8HRS'], JSON.stringify(data));
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_PENDING_FIXTURES,
                data: data,
                code: 201,
            });
        }
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingAllFixture));
    }
});
exports.fetchPendingFixture = fetchPendingFixture;
const searchFixture = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, date, status, stadium } = req.body;
        const { query } = req;
        let { perPage } = query;
        const page = Number(query.page) || 1;
        const limit = 10 || Number(perPage);
        const skip = (page * limit) - limit;
        const fixturePromise = yield fixtures_1.FixtureModel.find({
            $or: [
                { status },
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
        const countPromise = yield fixtures_1.FixtureModel.count();
        const [allFixtures, count] = yield Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, utils_1.genericErrors.invalidTeam);
        }
        else {
            const data = { teams: allFixtures, page, pages, count };
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_FIXTURES,
                data: data,
                code: 201,
            });
        }
    }
    catch (error) {
        return next(errorResponse(req, res, utils_1.genericErrors.errorFetchingAllFixture));
    }
});
exports.searchFixture = searchFixture;
//# sourceMappingURL=fixtures.js.map