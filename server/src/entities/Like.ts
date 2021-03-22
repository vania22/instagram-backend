import {BaseEntity} from "./BaseEntity";
import {Entity, ManyToOne} from "typeorm";
import {User} from "./User";
import {Post} from "./Post";
import {Comment} from "./Comment";
import {Field, ObjectType} from "type-graphql";

@ObjectType('Like')
@Entity()
export class Like extends BaseEntity {
    @Field(() => User)
    @ManyToOne(() => User, user => user.likes)
    user: User;

    @Field(() => Post)
    @ManyToOne(() => Post, post => post.likes)
    post: Post;

    @Field(() => Comment)
    @ManyToOne(() => Comment, comment => comment.likes)
    comment: Comment;
}
