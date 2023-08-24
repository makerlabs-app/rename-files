import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { walk } from "https://deno.land/std@0.199.0/fs/mod.ts";
import { red, green, blue } from "https://deno.land/std@0.199.0/fmt/colors.ts";

export const renameFiles = async ({
  path: directoryPath,
  prefix,
  suffix,
  extension,
  iteration
}: {
    path: string;
    prefix?: string;
    suffix?: string;
    extension?: string;
    iteration?: number;
}) => {
    let counter = (iteration !== undefined) ? iteration : 1;
    const tempFiles: { oldName: string; tempName: string }[] = [];

    console.log("Files in the directory:");
    for await (const entry of walk(directoryPath, { maxDepth: 1, includeDirs: false })) {
        const lastDotIndex = entry.path.lastIndexOf(".");
        if (lastDotIndex === -1) continue; // Skip files without extensions

        console.log(blue(entry.name));
    }

    const answer = prompt("Do you want to rename these files? (yes, no): ").toLowerCase();

    if (answer !== "yes" && answer !== "y") {
        console.log("Aborted!");
        return;
    }

    for await (const entry of walk(directoryPath, { maxDepth: 1, includeDirs: false })) {
        const lastDotIndex = entry.path.lastIndexOf(".");
        if (lastDotIndex === -1) continue;

        const tempName = `${self.crypto.randomUUID()}${counter}${extension || entry.path.substring(lastDotIndex)}`;
        tempFiles.push({ oldName: entry.name, tempName });
        await Deno.rename(entry.path, `${directoryPath}/${tempName}`);
        counter++;
    }

    counter = (iteration !== undefined) ? iteration : 1;
    for (const { oldName, tempName } of tempFiles) {
        const currentExtension = extension ? `.${extension}` : tempName.substring(tempName.lastIndexOf("."));
        const newName = `${prefix || ""}${counter}${suffix || ""}${currentExtension}`;
        await Deno.rename(`${directoryPath}/${tempName}`, `${directoryPath}/${newName}`);
        console.log(`${red(oldName)} -> ${green(newName)}`);
        counter++;
    }
}

const cli = new Command()
    .name("rename-files")
    .description("Rename files in the given directory.")
    .option("-a, --path <path:string>", "Path to the directory containing files to be renamed.")
    .option("-p, --prefix [prefix:string]", "Optional prefix to add to the file names.")
    .option("-s, --suffix [suffix:string]", "Optional suffix to add to the file names before the extension.")
    .option("-e, --extension [extension:string]", "Optional new extension for the files (without the dot).")
    .option("-i, --iteration [iteration:number]", "Starting number for iteration (default is 1).")
    .action(renameFiles);

if (import.meta.main) {
    await cli.parse(Deno.args);
}
