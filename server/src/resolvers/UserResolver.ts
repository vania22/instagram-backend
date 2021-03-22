import {Arg, Mutation, Resolver, Query, ObjectType, Field, Ctx, Authorized} from "type-graphql";
import {User} from "../entities/User";
import {IContext} from "../interfaces/IContext";
import {login, registrate} from "../services/UserResolverServices";

@ObjectType()
export class LoginResponse {
    @Field(() => String)
    accessToken: string;

    @Field(() => User)
    user: User
}

@Resolver(User)
export class UserResolver {
    @Mutation(() => Boolean)
    async register(
        @Arg("username") username: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
    ): Promise<boolean> {
        return await registrate(email, password, username);
    }

    @Mutation(() => LoginResponse)
    async login(@Ctx() {res}: IContext, @Arg('username') username: string, @Arg('password') password: string): Promise<LoginResponse> {
        return await login(username, password, res)
    }

    @Authorized()
    @Query(() => User)
    async me(@Ctx() {user}: IContext): Promise<User> {
        if(!user) throw new Error('User not found')
        return user
    }
}
