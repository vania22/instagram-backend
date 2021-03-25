import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {FileUpload} from "graphql-upload";
import {GraphQLUpload} from 'apollo-server-express';
import {IContext} from "../interfaces/IContext";
import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {Like} from "../entities/Like";
import {User} from "../entities/User";
import {_createPost, _deletePost, _getPostById, _updatePostDescription} from "../services/PostResolverService";

@Resolver(Post)
export class PostResolver {
    @Authorized()
    @Mutation(() => Post)
    async createPost(
        @Arg('image', () => GraphQLUpload!) image: FileUpload,
        @Arg('description') description: string,
        @Ctx() {user}: IContext): Promise<Post> {
       return _createPost(image, description, user!)
    }

    @Query(() => Post)
    async getPostById(@Arg('postId') postId: string): Promise<Post> {
        return _getPostById(postId)
    }

    @Authorized()
    @Mutation(() => Post)
    async updatePostDescription(
        @Arg('postId') postId: string,
        @Arg('description') description: string,
        @Ctx() {user}: IContext): Promise<Post> {
        return _updatePostDescription(postId, description, user!)
    }

    @Authorized()
    @Mutation(() => Post)
    async deletePost(
        @Arg('postId') postId: string,
        @Ctx() {user}: IContext): Promise<Post> {
        return await _deletePost(postId, user!)
    }

    @FieldResolver()
    async user(@Root() post: Post): Promise<User> {
        return await User.findOne({id: post.userId}) as User
    }

    @FieldResolver()
    async comments(@Root() post: Post): Promise<Comment[] | []> {
        return await Comment.find({post})
    }

    @FieldResolver()
    async likes(@Root() post: Post): Promise<Like[] | []> {
        return await Like.find({post})
    }

    @FieldResolver()
    async likesCount(@Root()post: Post): Promise<number> {
        const [_, likesCount] = await Like.findAndCount({post})
        return likesCount
    }

    @FieldResolver()
    async commentsCount(@Root()post: Post): Promise<number> {
        const [_, commentsCount] = await Comment.findAndCount({post})
        return commentsCount
    }
}
