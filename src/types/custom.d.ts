import { IUser } from "models/user";


interface IQuery {
   q?: string
}
 declare module 'express' {
    export interface Request {
        user?: IUser
       data?: string
       
      
    }

 }