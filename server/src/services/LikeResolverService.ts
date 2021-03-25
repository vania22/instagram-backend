import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {Like} from "../entities/Like";
import {User} from "../entities/User";

export const _toggleLike = async (id: string, user: User): Promise<Post> => {
    const post = await Post.findOne({id});
    const comment = await Comment.findOne({id})

    // If provided id === post
    if (!comment && post) {
        const existingLike = await Like.findOne({post, user})

        if (existingLike) {
            await existingLike.remove()
        } else {
            await Like.insert({user, post})
        }
        return post
    }
    // If provided id === comment
    else if (comment && !post) {
        const existingLike = await Like.findOne({comment, user})

        if (existingLike) {
            await existingLike.remove()
        } else {
            await Like.insert({user, comment})
        }
        return await Post.findOne({id: comment.postId}) as Post
    } else {
        throw new Error('Error! Post/Comment could possibly be deleted')
    }
}
