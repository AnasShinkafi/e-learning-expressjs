import { IUser } from "../models/user.model";
import { Request } from "express";

declare global {
    namespace Express{
        interface Request{
            user?: IUser;
        }
    }
}

// import { Request } from "express"
// import { IUser } from "../models/user.model"
// declare module 'express-serve-static-core' {
//     export interface Request {
//       user: IUser
//     }
//   }

// declare namespace Express {
//     export interface Request {
//         user: any;
//     }
//     export interface Response {
//         user: any;
//     }
//   }

// declare namespace Express {
//     export interface Request {
//       user: any
//     }
//   }

