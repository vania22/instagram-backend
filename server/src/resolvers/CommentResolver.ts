import {Arg, Authorized, Ctx, Mutation, Resolver} from "type-graphql";
import {IContext} from "../interfaces/IContext";
import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";

@Resolver(Comment)
export class CommentResolver {
    @Authorized()
    @Mutation(() => Post)
    async createComment(
        @Arg('postId') postId: number,
        @Arg('text') text: string,
        @Ctx() {user}: IContext): Promise<Post> {
        let post;
        try {
            post = await Post.findOneOrFail({id: postId})
        } catch (e) {
            console.log(e)
            throw new Error('Post not found')
        }

        await Comment.create({user, post, text}).save()

        return {
            ...post, commentsCount: post.commentsCount() + 1
        } as any
    }
}
