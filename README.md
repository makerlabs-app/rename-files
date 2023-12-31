# Rename Files CLI Tool

## Overview

This is a simple Deno-based command line tool that lets you rename files in a given directory. The tool offers flexibility with options to add prefixes, suffixes, and change file extensions.

## Requirements

* [Deno](https://deno.land/): Make sure you have Deno installed. If not, you can refer to [Deno's installation guide](https://deno.land/manual/getting_started/installation).

## Installation

No traditional installation is required since the script is run directly with Deno. 
You can clone the repository to get started or you can run the script remotely. 

## Usage

To use the tool, run the following command:

    deno task run --path your/directory

## Options

    -a, --path <path>: Specify the directory path containing files to be renamed. (This option is mandatory.)
    -p, --prefix [prefix]: Add an optional prefix to the file names.
    -s, --suffix [suffix]: Add an optional suffix to the file names right before the extension.
    -e, --extension [extension]: Optionally change the file extension to the provided one. (Note: Don't include the dot . with the extension.)
    -i, --iteration [startNumber]: Begin the renaming process from a specific iteration number. By default, it starts from 1.

## Example

To rename files in the directory named sample-dir, starting the iteration from number 5, and adding a prefix of file_ with a new extension jpg, execute:

#### Locale usage
    deno task run --path your/directory --prefix file_ --suffix _end --extension jpg --iteration 5
    
#### Remote usage
    deno run --allow-read --allow-write https://raw.githubusercontent.com/makerlabs-app/rename-files/v0.0.1/main.ts -a='files' -p=the_ -s=_test -e=txt -i=2

## Run tests
    
    deno test

## License

This software is distributed under the MIT license.
