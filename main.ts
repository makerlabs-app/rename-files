import { walk } from "https://deno.land/std@0.199.0/fs/mod.ts";
import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";

const renameFiles = async ({
   path: directoryPath,
   prefix,
   suffix,
   extension
}: {
    path: string;
    prefix?: string;
    suffix?: string;
    extension?: string;
}) => {
    let counter = 1;
    const tempFiles: string[] = [];

    for await (const entry of walk(directoryPath, { maxDepth: 1, includeDirs: false })) {
        const lastDotIndex = entry.path.lastIndexOf(".");

        // If the file has no extension, skip it.
        if (lastDotIndex === -1) continue;

        const tempName = `${self.crypto.randomUUID()}${counter}${extension || entry.path.substring(lastDotIndex)}`;
        tempFiles.push(tempName);

        await Deno.rename(entry.path, `${directoryPath}/${tempName}`);
        counter++;
    }

    counter = 1;
    for (const tempFile of tempFiles) {
        const currentExtension = extension ? `.${extension}` : tempFile.substring(tempFile.lastIndexOf("."));
        const newName = `${prefix || ""}${counter}${suffix || ""}${currentExtension}`;
        await Deno.rename(`${directoryPath}/${tempFile}`, `${directoryPath}/${newName}`);
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
    .action(renameFiles);

if (import.meta.main) {
    await cli.parse(Deno.args);
}

