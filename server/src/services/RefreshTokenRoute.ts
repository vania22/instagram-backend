import {Request, Response, Router} from 'express';
import {verify} from "jsonwebtoken";
import {User} from "../entities/User";
import {addRefreshTokenToCookie, newAccessToken} from "./TokenServices";

export const refreshTokenRouter = Router();

refreshTokenRouter.post('/refresh_token', async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.rfrshtkn
    try {
        const decodedToken: any = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        const user = await User.findOne({id: decodedToken.userId})

        if(user) {
            addRefreshTokenToCookie(res, user)
            return res.json({accessToken: newAccessToken(user)})
        } else {
            return res.json({accessToken: ''})
        }
    } catch (e) {
        return res.json({accessToken: ''})
    }
})
