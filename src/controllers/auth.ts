import { logger } from './../config/logger';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/user';
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';
import { Helper, constants, ApiError, genericErrors } from '../utils';


const { CREATE_USER_SUCCESSFULLY, CREATE_USER_FAILED, LOGIN_USER_SUCCESSFULLY, LOGIN_USER_FAILED } = constants;



export const createUser = async (req:Request, res:Response, next:NextFunction)  => {
  
  try {
    const {
      email, password, firstName, lastName, role
    } = req.body;
    const user = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: Helper.hashPassword(password),
      firstName,
      lastName,
      role
    });
   

    const token = Helper.generateToken( {id: user._id, email, role  });

    const doc = await user.save();
      return Helper.successResponse(res, {
        message: CREATE_USER_SUCCESSFULLY,
        data: {id: user._id, email, role , token }
      });

  } catch (error) {
    console.log(error)
    return next(new ApiError({ message: CREATE_USER_FAILED }));
  }
}

export const loginUser = async(req:Request, res:Response, next:NextFunction) => {
  try {
    const { password } = req.body;
    const isAuthenticUser = Helper.comparePassword(
      password,
      req.user.password,
    );
    if (!isAuthenticUser) {
      return Helper.errorResponse(req, res, genericErrors.inValidLogin);
    }

     const data = Helper.addTokenToData(req.user);
      Helper.successResponse(res, { data, message: LOGIN_USER_SUCCESSFULLY });
    } catch (e) {
      logger.error(e)
      return next(new ApiError({ message: LOGIN_USER_FAILED, errors: e.message }));
    }
  };