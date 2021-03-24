import {
    BaseEntity as TypeORMBaseEntity,
    CreateDateColumn, PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
export abstract class BaseEntity extends TypeORMBaseEntity {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date;
}
