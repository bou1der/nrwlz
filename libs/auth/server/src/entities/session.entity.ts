import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "session" })
export class Session extends BaseEntity {
  @PrimaryColumn({
    name: "id",
    type: "text",
  })
  id: string;

  @Column({
    type: "text",
    name: "token",
    unique: true,
  })
  token: string;

  @Column({
    type: "text",
    nullable: true,
    name: "ipAddress",
  })
  ipAddress: string | null;

  @Column({
    type: "text",
    nullable: true,
    name: "userAgent",
  })
  userAgent: string | null;

  @Column({
    nullable: true,
    type: "text",
    name: "impersonatedBy",
  })
  impersonatedBy: string | null;

  @Column({
    type: "text",
    name: "userId",
  })
  userId: string;

  @Column({
    type: "timestamp",
    name: "expiresAt",
  })
  expiresAt: Date;

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
