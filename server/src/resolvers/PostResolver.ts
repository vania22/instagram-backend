import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Post} from "../entities/Post";
import {IContext} from "../interfaces/IContext";
import {FileUpload} from "graphql-upload";
import {GraphQLUpload} from 'apollo-server-express';
import fs from "fs";
import path from "path";

@Resolver(Post)
export class PostResolver {
    @Authorized()
    @Mutation(() => Post)
    async createPost(
        @Arg('image',  () => GraphQLUpload!) image: FileUpload,
        @Arg('description') description: string,
        @Ctx() {user}: IContext): Promise<Post> {

        // @ts-ignore
        const {createReadStream, filename} = await image.promise!;
        const filenameToSave = Date.now() + filename
        try {
            await createReadStream()
                .pipe(fs.createWriteStream(path.join(__dirname, "../../public/postImages", filenameToSave)))
        }catch (e) {
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
    async getPostById(@Arg('postId') postId: number): Promise<Post> {
        const post = await Post.findOne({id: postId}, {relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user', 'comments.likes']})
        if (!post) throw new Error('Post has been deleted')
        return post
    }
}
