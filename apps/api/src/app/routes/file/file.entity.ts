import { CommonEntity } from "@lrp/shared";
import { Column, Entity } from "typeorm";

@Entity("files")
export class Files extends CommonEntity {

  @Column({
    type: "text",
  })
  fileName: string;

  @Column({
    type: "integer",
  })
  fileSize: number;

  @Column({
    type: "text",
    nullable: true,
  })
  placeholder: string | null = null;

  @Column({
    type: "text",
  })
  contentType: string;
}
