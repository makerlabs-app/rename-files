import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { walk } from "https://deno.land/std@0.199.0/fs/mod.ts";
import { red, green, blue } from "https://deno.land/std@0.199.0/fmt/colors.ts";

// **1.** Business Logic
export function determineNewFileName(oldName: string, counter: number, prefix?: string, suffix?: string, extension?: string): string {
    const lastDotIndex = oldName.lastIndexOf(".");
    const currentExtension = extension ? `.${extension}` : oldName.substring(lastDotIndex);
    return `${prefix || ""}${counter}${suffix || ""}${currentExtension}`;
}

export function validateUserInput(input: string): boolean {
    return ["yes", "y", "no", "n", ""].includes(input);
}

// **2.** Insulate external dependencies
export async function* getFiles(directoryPath: string): AsyncGenerator<string> {
    for await (const entry of walk(directoryPath, { maxDepth: 1, includeDirs: false })) {
        if (entry.name.includes(".") && entry.name.lastIndexOf(".") !== entry.name.length - 1) {
            yield entry.name;
        }
    }
}

export const renameOnDisk = async (oldPath: string, newPath: string) => {
    await Deno.rename(oldPath, newPath);
}

// **3.** Main Logic
export const renameFiles = async (options: {
    path: string;
    prefix?: string;
    suffix?: string;
    extension?: string;
    iteration?: number;
}) => {
    const { path: directoryPath, prefix, suffix, extension, iteration } = options;

    let counter = (iteration !== undefined) ? iteration : 1;
    const tempFiles: { oldName: string; tempName: string }[] = [];

    for await (const fileName of getFiles(directoryPath)) {
        console.log(blue(fileName));
    }

    let answer = (prompt("Do you want to rename these files? (yes/y, no/n): ") ?? "").toLowerCase();

    while (!validateUserInput(answer)) {
        console.log("Invalid input. Please enter 'yes', 'y', 'no', or 'n'.");
        answer = (prompt("Do you want to rename these files? (yes/y, no/n): ") ?? "").toLowerCase();
    }

    if (answer === "no" || answer === "n" || answer === "") {
        console.log("Aborted!");
        return;
    }

    for await (const oldName of getFiles(directoryPath)) {
        const tempName = `${self.crypto.randomUUID()}${counter}${extension || oldName.substring(oldName.lastIndexOf("."))}`;
        tempFiles.push({ oldName, tempName });
        await renameOnDisk(`${directoryPath}/${oldName}`, `${directoryPath}/${tempName}`);
        counter++;
    }

    counter = (iteration !== undefined) ? iteration : 1;
    for (const { oldName, tempName } of tempFiles) {
        const newName = determineNewFileName(oldName, counter, prefix, suffix, extension);
        await renameOnDisk(`${directoryPath}/${tempName}`, `${directoryPath}/${newName}`);
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
