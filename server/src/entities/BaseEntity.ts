import {
    BaseEntity as TypeORMBaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType()
export abstract class BaseEntity extends TypeORMBaseEntity{
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
}
