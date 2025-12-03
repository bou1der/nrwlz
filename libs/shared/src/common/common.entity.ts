import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import {
  BaseEntity,
  BeforeInsert,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn
} from "typeorm";
import { uuidv7 } from "uuidv7"

export class CommonEntity extends BaseEntity {
  constructor() {
    super()
  }

  assign(values: ValuesEntity<this>) {
    Object.assign(this, values);
    return this
  }

  @ApiProperty({
    type: String,
    format: "uuid",
    uniqueItems: true,
  })
  @PrimaryColumn({
    type: "varchar",
    length: 255,
  })
  id: string;

  @ApiProperty({
    type: Date,
  })
  @CreateDateColumn({
    type: "timestamp with time zone",
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  @UpdateDateColumn({
    type: "time with time zone"
  })
  updatedAt: Date;

  @Exclude({ toPlainOnly: true })
  @DeleteDateColumn({
    type: "timestamp with time zone",
  })
  deletedAt: Date | null;

  @BeforeInsert()
  protected onInsert() {
    if (!this.id) {
      this.id = uuidv7()
    }
  }
}
export type ValuesEntity<T extends object> = Partial<Omit<T, keyof CommonEntity>>

