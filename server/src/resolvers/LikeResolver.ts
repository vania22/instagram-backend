import {Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root} from "type-graphql";
import {Post} from "../entities/Post";
import {IContext} from "../interfaces/IContext";
import {Like} from "../entities/Like";
import {User} from "../entities/User";
import {Comment} from "../entities/Comment";
import {_toggleLike} from "../services/LikeResolverService";

@Resolver(Like)
export class LikeResolver {
    @Authorized()
    @Mutation(() => Post)
    async toggleLike(
        @Arg('id') id: string,
        @Ctx() {user}: IContext): Promise<Post> {
        return await _toggleLike(id, user!)
    }

    @FieldResolver()
    async user(@Root() like: Like): Promise<User> {
        return await User.findOne({id: like.userId}) as User
    }

    @FieldResolver()
    async post(@Root() like: Like): Promise<Post> {
        return await Post.findOne({id: like.postId}) as Post;
    }

    @FieldResolver()
    async comment(@Root() like: Like): Promise<Comment> {
        return await Comment.findOne({id: like.commentId}) as Comment
    }
}
