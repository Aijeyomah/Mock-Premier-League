import { Document, Model, model, Schema } from "mongoose";
import mongodbErrorHandler from 'mongoose-mongodb-errors';
import uniqueValidator from 'mongoose-unique-validator';
import  isEmail  from 'validator';


/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 */
export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;

}

const options = { timestamps: true };

const userSchema : Schema = new Schema({
   
    firstName: {
      type: String,
      required: 'Please Supply a first name!',
    },
    lastName: {
      type: String,
      required: 'Please Supply a last name!',
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        //validate: [isEmail, 'Invalid Email Address'],
        required: [true, 'Please Supply an email address'],
      },
  }, options);
  
  userSchema.plugin(uniqueValidator);
  userSchema.plugin(mongodbErrorHandler);
  const UserModel: Model<IUser> = model("User", userSchema);
  export default UserModel;