import {Entity, Column, OneToMany} from "typeorm";
import {Field, ObjectType} from "type-graphql";
import {IsEmail, Length} from "class-validator";
import {BaseEntity} from "./BaseEntity";
import {Post} from "./Post";
import {Like} from "./Like";
import {Comment} from "./Comment";

@ObjectType('User')
@Entity()
export class User extends BaseEntity {
    @Field(() => String)
    @Length(3, 36)
    @Column({unique: true})
    username: string;

    @Field(() => String)
    @IsEmail()
    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Field(() => [Post], {nullable: "items"})
    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @Field(() => [Comment], {nullable: "items"})
    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[]

    @Field(() => [Like], {nullable: "items"})
    @OneToMany(() => Like, like => like.user)
    likes: Like[];
}
