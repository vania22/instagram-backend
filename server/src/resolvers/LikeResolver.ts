import {Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root} from "type-graphql";
import {Post} from "../entities/Post";
import {IContext} from "../interfaces/IContext";
import {Like} from "../entities/Like";
import {User} from "../entities/User";
import {Comment} from "../entities/Comment";

@Resolver(Like)
export class LikeResolver {
    @Authorized()
    @Mutation(() => Post)
    async toggleLike(@Arg('id') id: number, @Ctx() {user}: IContext): Promise<Post> {
        const post = await Post.findOne({id});
        const comment = await Comment.findOne({id})

        if(!comment && post) {
            const existingLike = await Like.findOne({post, user})

            if(existingLike) {
                await existingLike.remove()
            } else {
                await Like.insert({user, post})
            }
            return post
        }else if(comment && !post) {
            const existingLike = await Like.findOne({comment, user})

            if(existingLike) {
                await existingLike.remove()
            } else {
                await Like.insert({user, comment})
            }
            return await Post.findOne(comment.post) as Post
        } else {
            throw new Error('Error! Post/Comment could possibly be deleted')
        }
    }

    @FieldResolver()
    async user(@Root() like: Like): Promise<User>{
        return await User.findOne({id: like.userId}) as User
    }

    @FieldResolver()
    async post(@Root() like: Like): Promise<Post>{
        return await Post.findOne({id: like.postId}) as Post;
    }

    @FieldResolver()
    async comment(@Root() like: Like): Promise<Comment>{
        return await Comment.findOne({id: like.commentId}) as Comment
    }
}
