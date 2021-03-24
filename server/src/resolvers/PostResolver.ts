import {Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import {FileUpload} from "graphql-upload";
import {GraphQLUpload} from 'apollo-server-express';
import fs from "fs";
import path from "path";
import {IContext} from "../interfaces/IContext";
import {Post} from "../entities/Post";
import {Comment} from "../entities/Comment";
import {Like} from "../entities/Like";
import {User} from "../entities/User";

@Resolver(Post)
export class PostResolver {
    @Authorized()
    @Mutation(() => Post)
    async createPost(
        @Arg('image', () => GraphQLUpload!) image: FileUpload,
        @Arg('description') description: string,
        @Ctx() {user}: IContext): Promise<Post> {

        // @ts-ignore
        const {createReadStream, filename} = await image.promise!;
        const filenameToSave = Date.now() + filename
        try {
            await createReadStream()
                .pipe(fs.createWriteStream(path.join(__dirname, "../../public/postImages", filenameToSave)))
        } catch (e) {
            throw new Error('File is too large, or in inappropriate format')
        }

        try {
            const post = await Post.create({
                description,
                imageUrl: `http://localhost:5000/postImages/${filenameToSave}`,
                user,
            })

            await Post.insert(post)
            return {...post, likes: [], comments: []} as any
        } catch (e) {
            console.log(e)
            throw new Error('Error has occurred, please try again later')
        }
    }

    @Query(() => Post)
    async getPostById(@Arg('postId') postId: string): Promise<Post> {
        const post = await Post.findOne({id: postId})
        if (!post) throw new Error('Post has been deleted')
        return post
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
