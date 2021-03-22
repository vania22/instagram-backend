import {Arg, Authorized, Ctx, Mutation, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {IContext} from "../interfaces/IContext";
import {Like} from "../entities/Like";

@Resolver(Like)
export class LikeResolver {
    @Authorized()
    @Mutation(() => Post)
    async toggleLike(@Arg('postId') postId: number, @Ctx() {user}: IContext): Promise<Post> {
        const post = await Post.findOne({id: postId}, {relations: ['likes', 'user', 'likes.user']});

        if(!post) throw new Error('Error! Post could possibly be deleted')

        const likeExists = post.likes.length > 0 ? post.likes.find(l => l.user.id === user!.id) : null

        if(likeExists) {
           await likeExists.remove()
            return {...post, likesCount: post.likesCount() -1} as any;
        }

        const newLike = await Like.create({post, user })
        await newLike.save()
        await post.reload()

        return {...post, likesCount: post.likesCount() +1} as any;
    }
}
