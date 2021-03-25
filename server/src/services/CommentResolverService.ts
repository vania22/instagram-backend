import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {User} from "../entities/User";

export const _createComment = async (text: string, postId: string, user: User): Promise<Post> => {
    try {
        const post = await Post.findOneOrFail({id: postId}, {relations: ['comments', 'comments.user']})

        await Comment.create({user, post, text}).save();
        return post
    } catch (e) {
        console.log(e)
        throw new Error('Post not found')
    }
}

export const _deleteComment = async (commentId: string, user: User): Promise<Post> => {
    const comment = await Comment.findOne({id: commentId})
    const post = await Post.findOne({id: comment?.postId})

    if (!comment) {
        throw new Error('Comment not found')
    }

    // If user is the owner of the comment
    if (comment.userId === user!.id) {
        await comment.remove()
        return post as Post
    }
    // If user is the owner of the post that has the comment
    else if (post?.userId === user!.id) {
        await comment.remove()
        return post as Post
    } else {
        throw new Error('Something went wrong')
    }
}
