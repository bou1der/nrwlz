import { UserRoleEnum } from "@lrp/shared";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "user" })
export class User extends BaseEntity {
  @PrimaryColumn({
    name: "id",
    type: "text",
  })
  id: string;

  @Column({
    type: "text",
    name: "name",
  })
  name: string;

  @Column({
    type: "text",
    name: "email",
    unique: true,
  })
  email: string;

  @Column({
    name: "emailVerified",
    type: "boolean",
  })
  emailVerified: boolean;

  // @Column({
  //   type: "text",
  //   unique: true,
  //   name: "phoneNumber",
  // })
  // phoneNumber: string;
  //
  // @Column({
  //   type: "boolean",
  //   name: "phoneNumberVerified",
  //   nullable: true,
  // })
  // phoneNumberVerified: boolean;

  @Column({
    type: "text",
    nullable: true,
    name: "image",
  })
  image: string | null;

  @Column({
    type: "enum",
    enum: UserRoleEnum,
    enumName: "user_role_enum",
    name: "role",
    default: UserRoleEnum.user,
  })
  role: UserRoleEnum;

  // @ManyToOne(
  // 	() => User,
  // 	tb => tb.referrals,
  // 	{
  // 		nullable: true,
  // 		onDelete: "SET NULL",
  // 	},
  // )
  // @JoinColumn({
  // 	name: "invited_by_id",
  // })
  // invitedBy: User | null;
  //
  // @Field(() => [User], {
  // 	nullable: true,
  // 	defaultValue: [],
  // 	middleware: [accessMdw<User>("id")],
  // })
  // @OneToMany(
  // 	() => User,
  // 	tb => tb.invitedBy,
  // )
  // referrals: User[];

  @Column({
    type: "boolean",
    nullable: true,
    name: "banned",
  })
  banned: boolean | null;

  @Column({
    type: "text",
    nullable: true,
    name: "banReason",
  })
  banReason: string | null;

  @Column({
    type: "timestamp",
    name: "banExpires",
    nullable: true,
  })
  banExpires: Date | null;

  @Column({
    type: "timestamp",
    name: "updatedAt",
  })
  updatedAt: Date;

  @Column({
    type: "timestamp",
    name: "createdAt",
  })
  createdAt: Date;
}
