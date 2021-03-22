import {User} from "../entities/User";
import {sign} from "jsonwebtoken";
import {Response} from "express";

export const newAccessToken = (user: User) => {
    return sign({userId: user.id}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: '15min'})
}

export const newRefreshToken = (user: User) => {
    return sign({userId: user.id}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '7d'})
}

export const addRefreshTokenToCookie = (res: Response, user: User) => {
    res.cookie('rfrshtkn', newRefreshToken(user), {httpOnly: true})
}
