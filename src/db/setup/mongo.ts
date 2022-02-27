import mongoose, { ConnectOptions } from 'mongoose';
import config from '../../config/env';



const MONGO_URI: string = config.DATABASE_URL;

export const db = (): any => {
  try {
    const db =  mongoose.connect(MONGO_URI);
    console.log('connected to db');
    return db;
  } catch (error) {
   
  }
};
