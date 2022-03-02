import { IUser } from './../models/user';
// export interface IUser{
//     id : string;
//     firstName: string,
//     lastName: string
//     role: string,
//     email: string,
// }

declare module 'express' {
    export interface Request {
        user?: IUser
       data?: string
       
      
    }
}