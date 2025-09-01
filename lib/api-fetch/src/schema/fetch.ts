import openapiTS, { astToString, OpenAPITSOptions } from "openapi-typescript";
import { factory } from "typescript";

import fs from "node:fs"
import path from 'node:path';
const BLOB = factory.createTypeReferenceNode("Blob");
const FILE = factory.createTypeReferenceNode("File");

const options: OpenAPITSOptions = {
  transform({ format, nullable }, metadata) {
    if (format !== "binary" || !metadata.path) {
      return;
    }
    const node = factory.createUnionTypeNode([FILE, BLOB]);
    return nullable ? factory.createUnionTypeNode([node, factory.createTypeReferenceNode("null")]) : node;
  },
};

async function fetchSchema() {
  const schema = await openapiTS(
    process.env.API_URL ? `${process.env.API_URL}/openapi/json` : "http://localhost:8000/openapi/json",
    options,
  );

  await fs.promises.writeFile(path.resolve(__dirname, "index.ts"), astToString(schema));
}

fetchSchema()
