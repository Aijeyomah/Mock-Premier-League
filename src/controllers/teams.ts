import { logger } from './../config/logger';
import { genericErrors, Helper, constants } from 'utils';
import { TeamModel } from './../models/teams';
import { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';



const { errorResponse, successResponse } = Helper;
const { SUCCESSFULLY_ADDED_TEAM, SUCCESSFULLY_REMOVED_TEAM, SUCCESSFULLY_FETCHED_ALL_TEAM, SUCCESSFULLY_UPDATED_TEAM } = constants;
/**
   *  admin can add team
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
export const addMembersToTeam = async (req: Request, res: Response, next: NextFunction) => {
    const {
        teamName, teamMembers, description
    } = req.body;
    try {
        const newTeams = new TeamModel({
            _id: new mongoose.Types.ObjectId(),
            teamName,
            teamMembers,
            description
        });
        const data = await newTeams.save();
        return successResponse(res, {
            data,
            message: SUCCESSFULLY_ADDED_TEAM,
            code: 201
        });
    } catch (error) {
        const err = error.errors.teamName.name === 'ValidatorError'
            ? errorResponse(req, res, genericErrors.duplicateTeamName)
            :
            errorResponse(req, res, genericErrors.errorAddingTeam)
        return err;

    }
}

/**
 *  admin can a remove team
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
export const removeTeam = async (req: Request, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    try {
        const team = await TeamModel.findByIdAndDelete({ _id: teamId }).exec();
        if (!team) {
            return errorResponse(req, res, genericErrors.invalidTeam);
        }
        return successResponse(res, {
            message: SUCCESSFULLY_REMOVED_TEAM,
            code: 201
        });
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorRemovingTeam));
    }
}

/**
 *  admin can edit a team method
 * @param {object} req - response object
 * @param {object} res - response object
 *
 * @returns {object} returns response
 *
 * @example
 *
 */
export const editTeam = async (req: Request, res: Response, next: NextFunction) => {
    const { teamName, teamMembers, description } = req.body;
    try {
        const team = await TeamModel.findByIdAndUpdate(
            { _id: req.params.teamId },
            {
                $set: {
                    teamName,
                    teamMembers,
                    description,
                    updatedAt: moment(Date.now()).format('LLLL')
                }
            },
            { useFindAndModify: false }
        )
            .exec();
        if (!team) {
            return errorResponse(req, res, genericErrors.invalidTeam);
        }
        return successResponse(res, {
            message: SUCCESSFULLY_UPDATED_TEAM,
            code: 201
        });
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorEditingTeam));
    }
}

/**
 *  view a team method
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

type Params = {
    teamId: string;
}
export const getTeam = async (req: Request<Params, {}, {}, {}>, res: Response, next: NextFunction) => {
    const { teamId } = req.params;
    try {
        const team = await TeamModel.findById({ _id: teamId })
            .select('_id teamName teamMembers description createdAt updatedAt')
            .exec();
        if (!team) {
            return errorResponse(req, res, genericErrors.invalidTeam);
        }
        return successResponse(res, {
            data: team,
            message: SUCCESSFULLY_UPDATED_TEAM,
            code: 201
        });
    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorFetchingTeam));
    }
}

type teamParams = {
    page: string;
};

/**
 *  view all team method
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

export const getAllTeams = async (req: Request<teamParams, {}, {}, {}>, res: Response, next: NextFunction) => {
    try {
        // Check page number from the params sent in the url or set default to 1
        const page: number = parseInt(req.params.page) || 1;

        // SET LIMIT OF number of posts to return
        const limit: number = 10;

        // SET THE NUMBER OF POSTS TO SKIP BASED ON PAGE NUMBER
        const skip: number = (page * limit) - limit;
        // const teams = await TeamModel.find()
        // Query the Database for all the Latest Published Posts in the DB
        const teamPromise = await TeamModel.find({

        }).sort({
            createdAt: -1,
        })
            .skip(skip)
            .limit(limit)
            .exec();
        const countPromise = await TeamModel.count();
        const [allTeams, count] = await Promise.all([teamPromise, countPromise]);
        const pages = Math.ceil(count / limit);

        // If posts is empty for paginated Pages
        if (!allTeams.length && skip) {
            logger.error('Could not fetch posts for user');
            return errorResponse(req, res, genericErrors.invalidTeam);
        } else {
            const data = { teams: allTeams, page, pages, count }
            return successResponse(res, {
                message: SUCCESSFULLY_FETCHED_ALL_TEAM,
                data: data,
                code: 201,
            });
        }

    } catch (error) {
        return next(errorResponse(req, res, genericErrors.errorFetchingTeam));
    }

}

/**
   *  user can search team method
   * @param {object} req - response object
   * @param {object} res - response object
   * @param {object} next - response object
   * @param {number} status - http status code
   * @param {string} statusMessage - http status message
   * @param {object} data - response data
   *
   * @returns {object} returns response
   *
   * @example
   *
   */

//   const searchTeam = (req: Request, res: Response) => {
//     try {
//     if (!req.query.q) {
//           logger.error('No Search Query Provided!');
//           errorResponse(req, res, genericErrors.cannotSearchForTeam);

//         }

//         const team = await new TeamModel.find({
//             $text: {
//                 $search: req.query.q,
//               }
//         })
//           .exec();
//         return response(res, 200, 'success', {
//           team,
//           count: team.length
//         });
//       }
//     } catch (error) {
//       return response(res, 400, 'error', {
//         message: messages.error
//       });
//     }
//   }
