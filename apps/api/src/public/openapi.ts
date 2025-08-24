import openapiTS, { astToString, OpenAPI3 } from "openapi-typescript";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { OpenAPIObject } from "@nestjs/swagger";
import chalk from "chalk";

export const DEFAULT_OUTPUT_DIR = "./__generated__";
const DEFAULT_FILENAME = "openapi.d.ts";

interface OpenApiSpec {
  document: OpenAPI3 | OpenAPIObject;
  fileName?: string;
}

export async function generateOpenApiSpecs(specs: OpenApiSpec[]): Promise<void> {
  if (specs.length === 0) {
    console.log(chalk.yellow("!  No OpenAPI specs provided"));
    return;
  }

  console.log(chalk.blue(`🔄 Generating ${specs.length} OpenAPI spec(s)...`));

  // Generate all specs in parallel
  const results = await Promise.allSettled(specs.map(spec => generateSingleSpec(spec)));

  // Process results
  const successful = results.filter(result => result.status === "fulfilled").length;
  const failed = results.filter(result => result.status === "rejected").length;

  if (failed > 0) {
    console.log(chalk.yellow(`!  ${failed} spec(s) failed to generate`));
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          chalk.red(`❌ Spec ${index + 1} (${specs[index].fileName || DEFAULT_FILENAME}): ${result.reason}`),
        );
      }
    });
  }

  if (successful > 0) {
    console.log(chalk.green(`✅ ${successful} OpenAPI spec(s) generated successfully`));
  }

  if (failed === specs.length) {
    throw new Error("All OpenAPI specs failed to generate");
  }
}

async function generateSingleSpec(spec: OpenApiSpec): Promise<void> {
  const fileName = spec.fileName || DEFAULT_FILENAME;
  const filePath = `${DEFAULT_OUTPUT_DIR}/${fileName}`;

  try {
    // Generate new OpenAPI types content
    const ast = await openapiTS(spec.document as OpenAPI3);
    const newContents = astToString(ast);

    // Check if content has changed
    const hasChanged = await hasContentChanged(filePath, newContents);

    if (!hasChanged) return;

    // Write the updated file
    await writeOpenApiFile(filePath, newContents);
    console.log(chalk.green(`  ✅ ${fileName} updated`));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate ${fileName}: ${errorMessage}`);
  }
}

async function hasContentChanged(filePath: string, newContents: string): Promise<boolean> {
  if (!fsSync.existsSync(filePath)) {
    return true;
  }

  try {
    const existingContents = await fs.readFile(filePath, "utf8");
    return existingContents !== newContents;
  } catch {
    return true;
  }
}

async function writeOpenApiFile(filePath: string, contents: string): Promise<void> {
  // Ensure directory exists
  await fs.mkdir(DEFAULT_OUTPUT_DIR, { recursive: true });

  // Write file
  await fs.writeFile(filePath, contents, "utf8");
}

// Convenience function for single spec (backward compatibility)
export async function generateOpenApiSpec(spec: OpenApiSpec): Promise<void> {
  return generateOpenApiSpecs([spec]);
}

