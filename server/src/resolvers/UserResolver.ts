import {Arg, Authorized, Ctx, Field, FieldResolver, Mutation, ObjectType, Query, Resolver, Root} from "type-graphql";
import {User} from "../entities/User";
import {IContext} from "../interfaces/IContext";
import {_followUser, _getUserById, _login, _register, _unfollowUser} from "../services/UserResolverService";
import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {Like} from "../entities/Like";

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
        return await _register(email, password, username);
    }

    @Mutation(() => LoginResponse)
    async login(@Ctx() {res}: IContext, @Arg('username') username: string, @Arg('password') password: string): Promise<LoginResponse> {
        return await _login(username, password, res)
    }

    @Authorized()
    @Query(() => User)
    async me(@Ctx() {user}: IContext): Promise<User> {
        if (!user) throw new Error('User not found')
        return user
    }

    @Query(() => User)
    async getUserById(@Arg('userId') userId: string): Promise<User> {
        return await _getUserById(userId)
    }

    @Authorized()
    @Mutation(() => User)
    async followUser(
        @Arg('userId') userId: string,
        @Ctx() {user}: IContext): Promise<User> {
        return await _followUser(userId, user!)
    }

    @Authorized()
    @Mutation(() => User)
    async unfollowUser(
        @Arg('userId') userId: string,
        @Ctx() {user}: IContext): Promise<User> {
        return await _unfollowUser(userId, user!)
    }

    @FieldResolver()
    async posts(@Root() user: User): Promise<Post[] | []> {
        return await Post.find({user})
    }

    @FieldResolver()
    async comments(@Root() user: User): Promise<Comment[] | []> {
        return await Comment.find({user})
    }

    @FieldResolver()
    async likes(@Root() user: User): Promise<Like[] | []> {
        return await Like.find({user})
    }

    @FieldResolver()
    async following(@Root() user: User): Promise<User[] | []> {
        const {following} = await User.findOne({id: user.id}, {relations: ['following']}) as User
        return following
    }

    @FieldResolver()
    async followers(@Root() user: User): Promise<User[] | []> {
        const {followers} = await User.findOne({id: user.id}, {relations: ['followers']}) as User
        return followers
    }

    @FieldResolver()
    async followersCount(@Root() user: User): Promise<number> {
        const {followers} = await User.findOne({id: user.id}, {relations: ['followers']}) as User
        return followers.length
    }

    @FieldResolver()
    async followingCount(@Root() user: User): Promise<number> {
        const {following} = await User.findOne({id: user.id}, {relations: ['following']}) as User
        return following.length
    }
}
