export type ExtractSchemas<T> = T extends { schemas: infer S } ? S : never;
export type FormKeys<S extends {}> = {
  [K in keyof S]: unknown
}

