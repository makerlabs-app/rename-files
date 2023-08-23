if (Deno.args.length < 1) {
    console.error("Veuillez fournir le chemin du répertoire en tant qu'argument.");
    Deno.exit(1);
}

const directoryPath = Deno.args[0];
const prefix = Deno.args[1] || "";

async function renameFilesInDirectory(dirPath, filePrefix) {
    let files = [];

    for await (const dirEntry of Deno.readDir(dirPath)) {
        if (dirEntry.isFile) {
            files.push(dirEntry.name);
        }
    }

    // Triez les fichiers par ordre alphabétique pour éviter des conflits
    files.sort();

    let count = 1;
    for (const filename of files) {
        const oldPath = `${dirPath}/${filename}`;
        const extension = filename.split('.').pop();

        const newName = `${filePrefix}${count}`;
        const newPath = `${dirPath}/${newName}.${extension}`;
        
        if (oldPath !== newPath) {
            await Deno.rename(oldPath, newPath);
        }
        count++;
    }
}

renameFilesInDirectory(directoryPath, prefix);
