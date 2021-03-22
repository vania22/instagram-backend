import {Request, Response} from "express";
import {User} from "../entities/User";

export interface IContext {
    req: Request,
    res: Response,
    user?: User
}
