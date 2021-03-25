import {Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root} from "type-graphql";
import {IContext} from "../interfaces/IContext";
import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {Like} from "../entities/Like";
import {User} from "../entities/User";
import {_createComment, _deleteComment} from "../services/CommentResolverService";

@Resolver(Comment)
export class CommentResolver {
    @Authorized()
    @Mutation(() => Post)
    async createComment(
        @Arg('postId') postId: string,
        @Arg('text') text: string,
        @Ctx() {user}: IContext): Promise<Post> {
        return await _createComment(text, postId, user!)
    }

    @Authorized()
    @Mutation(() => Post)
    async deleteComment(
        @Arg('commentId') commentId: string,
        @Ctx() {user}: IContext): Promise<Post> {
        return await _deleteComment(commentId, user!)
    }

    @FieldResolver()
    async likes(@Root() comment: Comment): Promise<Like[] | []> {
        return await Like.find({comment})
    }

    @FieldResolver()
    async user(@Root() comment: Comment): Promise<User> {
        return await User.findOne({id: comment.userId}) as User
    }

    @FieldResolver()
    async post(@Root() comment: Comment): Promise<Post> {
        return await Post.findOne({id: comment.postId}) as Post
    }

    @FieldResolver()
    async likesCount(@Root() comment: Comment): Promise<number> {
        const [_, likesCount] = await Like.findAndCount({comment})

        return likesCount
    }

}
