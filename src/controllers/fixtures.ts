import { redisDB } from '../db/index';
import { logger } from './../config/logger';
import { FixtureModel } from './../models/fixtures';
import { genericErrors, Helper, constants } from '../utils';
import { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';

const { errorResponse, successResponse, compareTwoTeams } = Helper;
const { SUCCESSFULLY_ADDED_FIXTURE, SUCCESSFULLY_DELETED_FIXTURE, SUCCESSFULLY_UPDATED_FIXTURES, 
    SUCCESSFULLY_FETCHED_FIXTURE, SUCCESSFULLY_FETCHED_FIXTURES,
     BASE_URL, REDIS_KEYS , SUCCESSFULLY_FETCHED_PENDING_FIXTURES, SUCCESSFULLY_FETCHED_COMPLETE_FIXTURES
    ,} = constants;

const { singleFixture, allFixturesKeys, completedFixturesKeys, pendingFixturesKeys } = REDIS_KEYS;

/**
 *  admin can add fixture
 * @param {object} req - response object
 * @param {object} res - response object
 * @param {number} status - http status code
 * @returns {object} returns response
 *
 * @example
 *
 */
export const createFixture = async(req: Request, res: Response, next: NextFunction) => {
    const { firstTeam, secondTeam, matchInfo } = req.body;
    try {
        const fixture = new FixtureModel({
            _id: new mongoose.Types.ObjectId(),
            firstTeam,
            secondTeam,
            matchInfo
        });

        const results = await FixtureModel.find({ firstTeam, secondTeam, matchInfo });
        if (results) {
            const pendingFixtures = results.filter(
                feature => feature.status === 'pending'
            );
            if (pendingFixtures.length > 0) {
                return errorResponse(req, res, genericErrors.duplicateFixtures);
            }
            
            const data = await fixture.save();
            return successResponse(res, {
                data: {fixtureLink:  `${BASE_URL}/api/v1/fixture/${data._id}`, data},
                message: SUCCESSFULLY_ADDED_FIXTURE,
            });
        }
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorAddingFixtures));
    }
}

/**
 *  admin can remove fixture
 * @param {object} req - response object
 * @param {object} res - response object
 *
 * @returns {object} returns response
\
 */
export const deleteFixture = async (req: Request, res: Response, next: NextFunction) => {
    const { fixtureId } = req.params;
    try {

        const fixture = await FixtureModel.findByIdAndDelete({
            _id: fixtureId
        }).exec();
        if (!fixture) {
            return errorResponse(req, res, genericErrors.invalidFixture);
        }
        await redisDB.del(singleFixture(fixtureId));
        logger.info('deleted from cache')
        return successResponse(res, {
            message: SUCCESSFULLY_DELETED_FIXTURE,
        });
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorDeletingFixture));
    }
}

/**
 *  admin can edit a fixture method
 * @param {object} req - response object
 * @param {object} res - response object
 *
 * @returns {object} returns response
 */
export const updateFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { body, params } = req;
        const {
            firstTeam, secondTeam, matchInfo, status
        } = body;

        const { fixtureId } = params;
        const fixture = await FixtureModel.findByIdAndUpdate(
            { _id: fixtureId },
            {
                $set: {
                    firstTeam,
                    secondTeam,
                    matchInfo,
                    status,
                    updatedAt: moment(Date.now()).format('LLLL')
                }
            },
            { useFindAndModify: false }
        ).exec();
        if (!fixture) {
            return errorResponse(req, res, genericErrors.invalidFixture);
        }
        return successResponse(res, {
            message: SUCCESSFULLY_UPDATED_FIXTURES,
        });
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorUpdatingFixture));
    }
}

/**
 *  admin can view a fixture method
 * @param {object} req - response object
 * @param {object} res - response object
 * @returns {object} returns response
 *
 * @example
 *
 */
export const viewSingleFixture = async (req: Request, res: Response, next: NextFunction) => {
    const { fixtureId } = req.params;
    try {
       
        const data = await redisDB.get(singleFixture(fixtureId));
       if(data){
           logger.info('returning from cache...')
        return successResponse(res, {
            data:  JSON.parse(data),
            message: SUCCESSFULLY_FETCHED_FIXTURE,
        });
       }
        const fixture = await FixtureModel.findById({ _id: fixtureId }).exec();
        if (!fixture) {
            return errorResponse(req, res, genericErrors.invalidFixture);
        }
       await redisDB.setEx(singleFixture(fixture._id), constants['8HRS'], JSON.stringify(fixture));

        return successResponse(res, {
            data: fixture,
            message: SUCCESSFULLY_FETCHED_FIXTURE,
        });
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorFetchingSingleFixture));

    }
}

/**
 *  Admin can view all fixture method
 * @param {object} req - response object
 * @param {object} res - response object
 *
 * @returns {object} returns response
 */
export const viewAllFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {

       const result = await redisDB.get(allFixturesKeys);
            if (result) {
                logger.info('returning from cache');
                
                return successResponse(res, {
                    message: SUCCESSFULLY_FETCHED_FIXTURES,
                    data: JSON.parse(result),
                    code: 201,
                });
            }
        // Check page number from the params sent in the url or set default to 1
        const page: number = parseInt(req.params.page) || 1;

        // SET LIMIT OF number of fixtures to return
        const limit: number = 10;

        // SET THE NUMBER OF POSTS TO SKIP BASED ON PAGE NUMBER
        const skip: number = (page * limit) - limit;
        const fixturePromise = await FixtureModel.find({

        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = await FixtureModel.count();
        const [allFixtures, count] = await Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);

        // If fixture is empty for paginated Pages
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, genericErrors.invalidTeam);
        } else {
            const data = { teams: allFixtures, page, pages, count }
            await redisDB.setEx(allFixturesKeys, constants['8HRS'], JSON.stringify(data));

            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_FIXTURES,
                data: data,
                code: 201,
            });
        }
    }
    catch (error) {
        console.log(error);
        
        return next(errorResponse(req, res, genericErrors.errorFetchingAllFixture));
    }
}

/**
 *  User can view all completed fixture method
 * @param {object} req - response object
 * @param {object} res - response object
 * @param {number} status - http status code
 * @param {string} statusMessage - http status message
 * @param {object} data - response data
 *
 * @returns {object} returns response
 *
 * @example
 *
 */
export const fetchCompletedFixtures = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await redisDB.get(completedFixturesKeys);
        if (result) {
            logger.info('returning from cache');
            
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_COMPLETE_FIXTURES,
                data: JSON.parse(result),
                code: 201,
            });
        }
        // Check page number from the params sent in the url or set default to 1
        const page: number = parseInt(req.params.page) || 1;

        // SET LIMIT OF number of fixtures to return
        const limit: number = 10;

        // SET THE NUMBER OF POSTS TO SKIP BASED ON PAGE NUMBER
        const skip: number = (page * limit) - limit;
        const fixturePromise = await FixtureModel.find({
            status: "completed"
        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = await FixtureModel.count();
        const [allFixtures, count] = await Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);

        // If posts is empty for paginated Pages
        if (!allFixtures.length && skip) {
            
            return errorResponse(req, res, genericErrors.invalidTeam);
        } 
        
            const data = { teams: allFixtures, page, pages, count }
            await redisDB.setEx(completedFixturesKeys, constants['8HRS'], JSON.stringify(data));
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_COMPLETE_FIXTURES,
                data: data,
                code: 201,
            });
      
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorFetchingAllFixture));

    }
}

/**
 *  User can view all pending fixture method
 * @param {object} req - response object
 * @param {object} res - response object
 * @param {number} status - http status code
 * @param {string} statusMessage - http status message
 * @param {object} data - response data
 *
 * @returns {object} returns response
 *
 * @example
 *
 */
export const fetchPendingFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const result = await redisDB.get(pendingFixturesKeys);
        if (result) {
            logger.info('returning from cache');
            
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_PENDING_FIXTURES,
                data: JSON.parse(result),
                code: 201,
            });
        }
        // Check page number from the params sent in the url or set default to 1
        const page: number = parseInt(req.params.page) || 1;

        // SET LIMIT OF number of fixtures to return
        const limit: number = 10;

        // SET THE NUMBER OF POSTS TO SKIP BASED ON PAGE NUMBER
        const skip: number = (page * limit) - limit;
        const fixturePromise = await FixtureModel.find({
            status: "pending"
        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = await FixtureModel.count();
        const [allFixtures, count] = await Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);

        // If posts is empty for paginated Pages
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, genericErrors.invalidTeam);
        } else {
            const data = { teams: allFixtures, page, pages, count }
            await redisDB.setEx(pendingFixturesKeys, constants['8HRS'], JSON.stringify(data));

            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_PENDING_FIXTURES,
                data: data,
                code: 201,
            });
        }
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorFetchingAllFixture));

    }
}

/**
 *  user can search fixture method
 * @param {object} req - response object
 * @param {object} res - response object
 * @returns {object} returns response
 *
 */
export const searchFixture = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { name, date, status, stadium } = req.body;
        const { query } = req;
        let { perPage } = query;
        // Check page number from the params sent in the url or set default to 1
        const page: number = Number(query.page) || 1;

        // SET LIMIT OF number of fixtures to return
        const limit: number = 10 || Number(perPage);

        // SET THE NUMBER OF POSTS TO SKIP BASED ON PAGE NUMBER
        const skip: number = (page * limit) - limit;
        const fixturePromise = await FixtureModel.find({
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
        const countPromise = await FixtureModel.count();
        const [allFixtures, count] = await Promise.all([fixturePromise, countPromise]);
        const pages = Math.ceil(count / limit);

        // If posts is empty for paginated Pages
        if (!allFixtures.length && skip) {
            return errorResponse(req, res, genericErrors.invalidTeam);
        } else {
            const data = { teams: allFixtures, page, pages, count }
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_FIXTURES,
                data: data,
                code: 201,
            });
        }
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorFetchingAllFixture));

    }
}