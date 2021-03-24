import {BaseEntity} from "./BaseEntity";
import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {User} from "./User";
import {Comment} from "./Comment";
import {Field, Int, ObjectType} from "type-graphql";
import {MaxLength} from "class-validator";
import {Like} from "./Like";
import {Expose} from "class-transformer";

@ObjectType('Post')
@Entity()
export class Post extends BaseEntity {
    @Field(() => User)
    @ManyToOne(() => User, user => user.posts)
    user: User;

    @Column()
    userId: string;

    @Field(() => String)
    @Column()
    @MaxLength(256)
    description: string

    @Field(() => String, {nullable: false})
    @Column()
    imageUrl: string

    @Field(() => [Like], {nullable: "items"})
    @OneToMany(() => Like, like => like.post)
    likes: Like[]

    @Field(() => [Comment], {nullable: "items"})
    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[]

    @Expose()
    @Field(() => Int)
    likesCount: number

    @Expose()
    @Field(() => Int)
    commentsCount: number
}
