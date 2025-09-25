import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "verification" })
export class Verification {
  @PrimaryColumn({
    name: "id",
    type: "text",
  })
  id: string;

  @Column({
    type: "text",
    name: "identifier",
  })
  identifier: string;

  @Column({
    type: "text",
    name: "value",
  })
  value: string;

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
