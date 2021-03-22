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
            post = await Post.findOneOrFail({id: postId}, {relations: ['comments', 'comments.user']})
        } catch (e) {
            console.log(e)
            throw new Error('Post not found')
        }

       const comment =  await Comment.create({user, post, text});
        await comment.save()
        await post.reload()

        return {
            ...post, commentsCount: post.commentsCount() + 1, comments: [...post.comments, comment]
        } as any
    }
}
