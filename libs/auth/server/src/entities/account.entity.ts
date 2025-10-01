import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "account" })
export class Account {
  @PrimaryColumn({
    name: "id",
    type: "text",
  })
  id: string;

  @Column({
    type: "text",
    name: "accountId",
  })
  accountId: string;

  @Column({
    type: "text",
    name: "providerId",
  })
  providerId: string;

  @Column({
    type: "text"
  })
  userId: string;

  @Column({
    type: "text",
    name: "accessToken",
    nullable: true,
  })
  accessToken: string | null;

  @Column({
    type: "text",
    name: "refreshToken",
    nullable: true,
  })
  refreshToken: string | null;

  @Column({
    type: "text",
    name: "idToken",
    nullable: true,
  })
  idToken: string | null;

  @Column({
    type: "timestamp",
    name: "accessTokenExpiresAt",
    nullable: true,
  })
  accessTokenExpiresAt: Date | null;

  @Column({
    type: "timestamp",
    name: "refreshTokenExpiresAt",
    nullable: true,
  })
  refreshTokenExpiresAt: Date | null;

  @Column({
    type: "text",
    name: "scope",
    nullable: true,
  })
  scope: string | null;

  @Column({
    type: "text",
    name: "password",
    nullable: true,
  })
  password: string | null;

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
