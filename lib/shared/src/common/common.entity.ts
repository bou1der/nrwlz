import { ApiProperty } from "@nestjs/swagger";
import { BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { uuidv7 } from "uuidv7"

export class CommonEntity {
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
  @UpdateDateColumn({
    type: "time with time zone"
  })
  updatedAt: Date;

  @ApiProperty({
    type: Date,
  })
  @CreateDateColumn({
    type: "timestamp with time zone",
  })
  createdAt: Date;

  @BeforeInsert()
  protected onInsert() {
    if (!this.id) {
      this.id = uuidv7()
    }
  }

}
