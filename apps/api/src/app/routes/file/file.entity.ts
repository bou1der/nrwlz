import { CommonEntity, ValuesEntity } from "@lrp/shared/common/common.entity";
import { Column, Entity } from "typeorm";

@Entity("files")
export class IFiles extends CommonEntity {
  constructor(values?: ValuesEntity<IFiles>) {
    super();
    if (values) Object.assign(this, values);
  }

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
