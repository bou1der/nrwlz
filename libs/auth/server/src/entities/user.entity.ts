import { UserRoleEnum } from "@lrp/shared/types/user";
import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "user" })
export class IUser extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    format: "uuid",
  })
  @PrimaryColumn({
    name: "id",
    type: "text",
  })
  id: string;

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Telegram ID",
  })
  @Column({
    unique: true,
    type: "varchar",
    length: 255,
    nullable: true,
  })
  telegramId: string | null;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @Column({
    type: "text",
    name: "name",
  })
  name: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @Column({
    type: "text",
    name: "email",
    unique: true,
  })
  email: string;

  @ApiProperty({
    type: Boolean,
    nullable: false,
  })
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

  @ApiProperty({
    type: String,
    nullable: true,
    description: "Image URL",
  })
  @Column({
    type: "text",
    nullable: true,
    name: "image",
  })
  image: string | null;

  @ApiProperty({
    enum: UserRoleEnum,
    default: UserRoleEnum.user,
  })
  @Column({
    type: "enum",
    enum: UserRoleEnum,
    enumName: "user_role_enum",
    name: "role",
    default: UserRoleEnum.user,
  })
  role: UserRoleEnum;

  @Column({
    type: "boolean",
    default: false,
  })
  earnedByInviter: boolean

  @ApiProperty({
    type: Number,
    description: "User balance"
  })
  @Column({
    type: "double precision",
    default: 0
  })
  balance: number;

  @ApiProperty({
    type: Boolean,
    nullable: true,
  })
  @Column({
    type: "boolean",
    nullable: true,
    name: "banned",
    default: false,
  })
  banned: boolean | null;

  @ApiProperty({
    type: String,
    nullable: true,
  })
  @Column({
    type: "text",
    nullable: true,
    name: "banReason",
  })
  banReason: string | null;

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  @Column({
    type: "timestamp",
    name: "banExpires",
    nullable: true,
  })
  banExpires: Date | null;

  @ApiProperty({
    type: Date,
  })
  @Column({
    type: "timestamp",
    name: "updatedAt",
  })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
  })
  @Column({
    type: "timestamp",
    name: "createdAt",
  })
  createdAt: Date;
}
