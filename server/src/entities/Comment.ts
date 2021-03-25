import {BaseEntity} from "./BaseEntity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {User} from "./User";
import {Field, Int, ObjectType} from "type-graphql";
import {MaxLength} from "class-validator";
import {Like} from "./Like";
import {Expose} from "class-transformer";
import {Post} from "./Post";

@ObjectType('Comment')
@Entity()
export class Comment extends BaseEntity {
    @Field(() => User)
    @ManyToOne(() => User, user => user.comments)
    user: User;

    @Column()
    userId: string;

    @Field(() => String, {nullable: false})
    @Column()
    @MaxLength(256)
    text: string

    @Field(() => [Like], {nullable: "items"})
    @OneToMany(() => Like, like => like.comment)
    likes: Like[]

    @Field(() => Post)
    @ManyToOne(() => Post, post => post.comments, {onDelete: 'CASCADE'})
    post: Post

    @Column()
    postId: string;

    @Expose()
    @Field(() => Int)
    likesCount: number;
}
