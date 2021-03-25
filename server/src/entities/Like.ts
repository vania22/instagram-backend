import {BaseEntity} from "./BaseEntity";
import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
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

    @Field(() => Post, {nullable: true})
    @ManyToOne(() => Post, post => post.likes, {onDelete: 'CASCADE'})
    @JoinColumn()
    post: Post;

    @Field(() => Comment, {nullable: true})
    @ManyToOne(() => Comment, comment => comment.likes, {onDelete: 'CASCADE'})
    comment: Comment;

    @Column()
    userId: string;

    @Column({nullable: true})
    postId: string;

    @Column({nullable: true})
    commentId: string;
}
