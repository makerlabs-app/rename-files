import { assertEquals } from "https://deno.land/std@0.199.0/assert/mod.ts";
import { renameFiles } from "./main.ts";  // Modify the path accordingly

Deno.test("Should rename files with prefix", async () => {
  const testDir = "./test-directory";
  await renameFiles({ path: testDir, prefix: "test_" });

  // Here we are assuming that your directory has a known file structure for testing.
  const files = [...Deno.readDirSync(testDir)];

  // Check the first file to see if it was renamed with the prefix.
  assertEquals(files[0].name.startsWith("test_"), true);
});

Deno.test("Should rename files with new extension", async () => {
  const testDir = "./test-directory";
  await renameFiles({ path: testDir, extension: "test" });

  const files = [...Deno.readDirSync(testDir)];

  // Check the first file to see if its extension was changed.
  assertEquals(files[0].name.endsWith(".test"), true);
});

Deno.test("Should start renaming from specific iteration", async () => {
  const testDir = "./test-directory";
  await renameFiles({ path: testDir, iteration: 5 });

  const files = [...Deno.readDirSync(testDir)];

  // Extracting number from renamed file
  const matched = files[0].name.match(/(\d+)/);
  const numberFromName = matched ? parseInt(matched[0]) : 0;

  assertEquals(numberFromName >= 5, true);
});

// ... add more tests as necessary

