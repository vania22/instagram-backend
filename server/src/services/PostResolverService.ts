import fs from "fs";
import path from "path";
import {FileUpload} from "graphql-upload";
import {Post} from "../entities/Post";
import {User} from "../entities/User";

export const _createPost = async (image: FileUpload, description: string, user: User): Promise<Post> => {
    // image.promise! -- this is a workaround of the bug in "graphql-upload" library
    // @ts-ignore
    const {createReadStream, filename} = await image.promise!;
    const filenameToSave = Date.now() + filename
    // Saving file to /public/postImages
    try {
        await createReadStream()
            .pipe(fs.createWriteStream(path.join(__dirname, "../../public/postImages", filenameToSave)))
    } catch (e) {
        throw new Error('File is too large, or in inappropriate format')
    }

    try {
        return await Post.create({
            description,
            imageUrl: `http://localhost:5000/postImages/${filenameToSave}`,
            user,
        }).save()
    } catch (e) {
        console.log(e)
        throw new Error('Error has occurred, please try again later')
    }
}

export const _getPostById = async (postId: string): Promise<Post> => {
    const post = await Post.findOne({id: postId})
    if (!post) throw new Error('Post has been deleted')
    return post
}

export const _updatePostDescription = async (postId: string, description: string, user: User): Promise<Post> => {
    const post = await Post.findOne({id: postId, userId: user.id});
    if (!post) throw new Error('Post has been deleted')
    post.description = description;
    return await post.save()
}

export const _deletePost = async (postId: string, user: User): Promise<Post> => {
    const post = await Post.findOne({id: postId, userId: user!.id});
    if (!post) throw new Error('Post has been deleted')
    await post.remove()
    return {...post, id: postId} as Post
}
