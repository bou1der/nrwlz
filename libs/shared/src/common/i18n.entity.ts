// import { Column } from "typeorm";
// import { CommonEntity } from "./common.entity";
// import { I18nCode } from "../types";
// import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
//
// type Constructor<T = object> = new (...args: any[]) => T;
//
// export const I18TablePostfix = "i18n"
//
// export class I18nLocale extends CommonEntity {
//   @Column({
//     type: "enum",
//     enum: I18nCode,
//   })
//   lang: I18nCode;
// }
//
// export function I18nEntity<L extends Constructor<I18nLocale>>(target: L) {
//   type Fields = Exclude<keyof InstanceType<L>, keyof I18nLocale>
//   const i18nlocale = new target()
//   const locale = new I18nLocale()
//   const fields: Fields[] = []
//
//   for (const field in i18nlocale) {
//     if (field in locale) {
//       fields.push(field as Fields)
//     }
//   }
//
//
//   class Assigned extends PickType(
//     target,
//     fields
//   ) {
//     __fields = fields
//   }
//   return Assigned
// }
//
//
//
//
// export class IBookI18n extends I18nLocale {
//   @ApiProperty({
//     type: String,
//   })
//   @Column({
//     type: "varchar",
//     length: 255,
//   })
//   title: string;
//
//   @ApiProperty({
//     type: String,
//   })
//   @Column({
//     type: "varchar",
//     length: 255,
//   })
//   author: string;
//
//   @ApiProperty({
//     type: String,
//   })
//   @Column({
//     type: "text"
//   })
//   description: string;
// }
//
// export class IBook extends I18nEntity(IBookI18n) {
// }
//
//
// new IBook()
