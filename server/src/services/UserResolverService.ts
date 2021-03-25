import {compareSync, hash} from "bcrypt";
import {Response} from "express";
import {User} from "../entities/User";
import {LoginResponse} from "../resolvers/UserResolver";
import {addRefreshTokenToCookie, newAccessToken} from "./TokenServices";

export const _register = async (email: string, password: string, username: string): Promise<boolean> => {
    const usedEmail = await User.findOne({email})
    const usedUsername = await User.findOne({username})

    if (usedEmail) {
        throw new Error('User with given email already exists')
    }

    if (usedUsername) {
        throw new Error('User with given username already exists')
    }

    if (password.trim().length < 6) {
        throw new Error('Password must be at least 6 characters long')
    }

    const hashedPassword = await hash(password, 10)

    try {
        await User.insert({username, email, password: hashedPassword})
        return true
    } catch (e) {
        throw new Error('Error has occurred, please try again later...')
    }
}

export const _login = async (username: string, password: string, res: Response): Promise<LoginResponse> => {
    const user = await User.findOne({username})

    if (!user) {
        throw new Error('Invalid login details')
    }

    const passwordMatch = compareSync(password, user.password)

    if (!passwordMatch) {
        throw new Error('Invalid login details')
    }

    addRefreshTokenToCookie(res, user)

    return {
        accessToken: newAccessToken(user), user,
    }
}

export const _getUserById = async (userId: string): Promise<User> => {
    try {
        return User.findOneOrFail({id: userId})
    } catch (e) {
        throw new Error('User not found')
    }
}
