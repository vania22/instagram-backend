import {AuthChecker} from "type-graphql";
import {IContext} from "../interfaces/IContext";
import {verify} from "jsonwebtoken";
import {User} from "../entities/User";

export const isAuthorized: AuthChecker<IContext> = async ({context}) => {
    const accessToken = context.req.headers['authorization'] as string;
    if (!accessToken) {
        return false
    }
    try {
        const {userId}: any = verify(accessToken.split(' ')[1], process.env.ACCESS_TOKEN_SECRET!)
        context.user = await User.findOne({id: userId})
        return true;
    } catch (e) {
        return false;
    }
};
