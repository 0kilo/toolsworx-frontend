import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const testsRoot = path.join(root, "tests");

function isTestFile(file: string) {
  return file.endsWith(".test.ts") || file.endsWith(".test.js");
}

function collectTests(dir: string, results: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectTests(fullPath, results);
    } else if (entry.isFile() && isTestFile(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function run() {
  const testFiles = collectTests(testsRoot).sort();
  if (testFiles.length === 0) {
    console.log("No tool tests found.");
    return;
  }

  console.log(`Running ${testFiles.length} tool tests...`);
  let failures = 0;

  for (const file of testFiles) {
    const rel = path.relative(root, file);
    try {
      const mod = await import(pathToFileURL(file).toString());
      const runner = mod.run || mod.default;
      if (typeof runner !== "function") {
        throw new Error("Test file does not export a run() function");
      }
      await runner();
      console.log(`✔ ${rel}`);
    } catch (error: any) {
      failures++;
      console.error(`✖ ${rel}`);
      console.error(`  ${error?.message || error}`);
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} test(s) failed`);
  }
}

run().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
