// import { FixtureModel } from './../models/fixtures';
// import { genericErrors, Helper, constants } from 'utils';
// import { TeamModel } from './../models/teams';
// import { Response, Request, NextFunction } from 'express';
// import mongoose from 'mongoose';
// import moment from 'moment';

// const { errorResponse, successResponse, compareTwoTeams } = Helper;

//   /**
//    *  admin can add fixture
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const addFixture = (req, res) => {
//     const { teamA, teamB, matchInfo } = req.body;
//     try {
//       // console.log('I am executed');
      
//       const fixture = new FixtureModel({
//         _id: new mongoose.Types.ObjectId(),
//         teamA,
//         teamB,
//         matchInfo
//       });

//       const compare = await compareTwoTeams(teamA, teamB);
//       if (compare) {
//         return response(res, 409, 'error', {
//           message: messages.sameTeam
//         });
//       }
//       const results = await FixtureModel.find({ teamA, teamB, matchInfo });
//       const itsPendingFixture = results.filter(
//         result => result.status === 'pending'
//       );
//       if (itsPendingFixture.length >= 1) {
//         return response(res, 409, 'error', {
//           message: messages.existingFixture
//         });
//       }
//       const createfixture = await fixture.save();
//       if (createfixture) {
//         return response(res, 201, 'success', {
//           createfixture
//         });
//       }
//     } catch (error) {
//       return response(res, 400, 'error', {
//         message: messages.error
//       });
//     }
//   }

//   /**
//    *  admin can remove fixture
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const removeFixture(req, res) {
//     const { fixtureId } = req.params;
//     try {
      
//       const fixture = await FixtureModel.findByIdAndDelete({
//         _id: fixtureId
//       }).exec();
//       if (!fixture) {
//         return response(res, 404, 'error', {
//           message: messages.notfound
//         });
//       }
//       return response(res, 200, 'success', {
//         message: messages.deleteMessage
//       });
//     } catch (error) {
//       error.name === 'CastError'
//         ? response(res, 400, 'error', {
//           message: messages.castError
//         })
//         : response(res, 400, 'error', {
//           message: messages.error
//         });
//     }
//   }

//   /**
//    *  admin can edit a fixture method
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const editFixture(req, res) {
//     try {
//       const { body, params } = req;
//       const {
//         teamA, teamB, matchInfo, status
//       } = body;
      
//       const { fixtureId } = params;
//       const fixture = await FixtureModel.findByIdAndUpdate(
//         { _id: fixtureId },
//         {
//           $set: {
//             teamA,
//             teamB,
//             matchInfo,
//             status,
//             updatedAt: moment(Date.now()).format('LLLL')
//           }
//         },
//         { useFindAndModify: false }
//       ).exec();
//       if (!fixture) {
//         return response(res, 404, 'error', {
//           message: messages.notfound
//         });
//       }
//       return response(res, 200, 'success', {
//         message: messages.updateMessage
//       });
//     } catch (error) {
//       error.name === 'CastError'
//         ? response(res, 400, 'error', {
//           message: messages.castError
//         })
//         : response(res, 400, 'error', {
//           message: messages.error
//         });
//     }
//   }

//   /**
//    *  admin can view a fixture method
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const viewAFixture(req, res) {
//     const { fixtureId } = req.params;
//     try {
      
//       const fixture = await FixtureModel.findById({ _id: fixtureId }).exec();
//       if (!fixture) {
//         return response(res, 404, 'error', {
//           message: messages.notfound
//         });
//       }
//       return response(res, 200, 'success', {
//         fixture
//       });
//     } catch (error) {
//       error.name === 'CastError'
//         ? response(res, 400, 'error', {
//           message: messages.castError
//         })
//         : response(res, 400, 'error', {
//           message: messages.error
//         });
//     }
//   }

//   /**
//    *  Admin can view all fixture method
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const viewAllFixture(req, res) {
//     try {
//       let { page, perPage } = req.query;
//       perPage = perPage ? parseInt(perPage, 10) : 10;
//       page = page ? parseInt(page, 10) : 1;
      
//       const fixture = await FixtureModel.find()
//         .skip((page - 1) * perPage)
//         .limit(perPage)
//         .sort({ createdAt: -1 })
//         .exec();
//       return response(res, 200, 'success', {
//         fixture,
//         count: fixture.length
//       });
//     } catch (error) {
//       response(res, 400, 'error', {
//         message: messages.error
//       });
//     }
//   }

//   /**
//    *  User can view all completed fixture method
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const viewCompletedFixture(req, res) {
//     try {
//       let { page, perPage } = req.query;
//       perPage = perPage ? parseInt(perPage, 10) : 10;
//       page = page ? parseInt(page, 10) : 1;
//       const fixture = await FixtureModel.find({ status: 'completed' })
//         .skip((page - 1) * perPage)
//         .limit(perPage)
//         .sort({ createdAt: -1 })
//         .exec();
//       return response(res, 200, 'success', {
//         fixture,
//         count: fixture.length
//       });
//     } catch (error) {
//       return response(res, 400, 'error', {
//         message: messages.error
//       });
//     }
//   }

//   /**
//    *  User can view all pending fixture method
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const viewPendingFixture(req, res) {
//     try {
//       let { page, perPage } = req.query;
//       perPage = perPage ? parseInt(perPage, 10) : 10;
//       page = page ? parseInt(page, 10) : 1;
//       const fixture = await FixtureModel.find({ status: 'pending' })
//         .skip((page - 1) * perPage)
//         .limit(perPage)
//         .sort({ createdAt: -1 })
//         .exec();
//       return response(res, 200, 'success', {
//         fixture,
//         count: fixture.length
//       });
//     } catch (error) {
//       return response(res, 400, 'error', {
//         message: messages.error
//       });
//     }
//   }

//   /**
//    *  user can search fixture method
//    * @param {object} req - response object
//    * @param {object} res - response object
//    * @param {object} next - response object
//    * @param {number} status - http status code
//    * @param {string} statusMessage - http status message
//    * @param {object} data - response data
//    *
//    * @returns {object} returns response
//    *
//    * @example
//    *
//    */
//   const searchFixture(req, res) {
//     try {
//       const { name, date, status } = req.body;
//       const { body, query } = req;
//       let { page, perPage } = query;
//       perPage = perPage ? parseInt(perPage, 10) : 10;
//       page = page ? parseInt(page, 10) : 1;
//       let { stadium } = body;
//       if (name || date || stadium || status) {
//         stadium = new RegExp(`^${stadium}$`, 'i');
//         const fixture = await FixtureModel.find({
//           $or: [
//             { status },
//             { 'teamA.0.name': new RegExp(`^${name}$`, 'i') },
//             { 'teamB.0.name': new RegExp(`^${name}$`, 'i') },
//             { matchInfo: { $elemMatch: { date, stadium } } }
//           ]
//         })
//           .skip((page - 1) * perPage)
//           .limit(perPage)
//           .sort({ createdAt: -1 })
//           .exec();
//         return response(res, 200, 'success', {
//           fixture,
//           count: fixture.length
//         });
//       }
//     } catch (error) {
//       return response(res, 400, 'error', {
//         message: messages.error
//       });
//     }
//   }
// }
