#!/usr/bin/env node
import { getVersion } from "./getVersion.js";

// Parse arguments
const args = process.argv.slice(2);
const parsedArgs = {};

// Simple argument parser
for (let i = 0; i < args.length; i++) {
  const arg = args[i];

  if (arg.startsWith("--")) {
    const key = arg.slice(2);
    if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
      parsedArgs[key] = args[i + 1];
      i++;
    } else {
      parsedArgs[key] = true;
    }
  } else if (arg.startsWith("-")) {
    const key = arg.slice(1);
    if (i + 1 < args.length && !args[i + 1].startsWith("-")) {
      parsedArgs[key] = args[i + 1];
      i++;
    } else {
      parsedArgs[key] = true;
    }
  }
}

// Map short flags to their full names
const params = {
  repo: parsedArgs.r || parsedArgs.repo,
  owner: parsedArgs.o || parsedArgs.owner,
  env: parsedArgs.e || parsedArgs.env || "main",
  preRelease: parsedArgs.p || parsedArgs.preRelease || false,
  token: parsedArgs.t || parsedArgs.token || process.env.GITHUB_TOKEN,
};

function showHelp() {
  console.log(`
Usage: get-version --repo REPO --owner OWNER [OPTIONS]

Options:
  -r, --repo REPO            Repository name (required)
  -o, --owner OWNER          Repository owner (required)
  -e, --env ENV              The environment/branch to get version for (default: main)
  -p, --preRelease           Include pre-releases (default: false)
  -t, --token TOKEN          GitHub token (required unless GITHUB_TOKEN env var is set)
  -h, --help                 Show this help message
  
Example:
  get-version --repo my-repo --owner my-user --env main --token ghp_12345
  get-version -r my-repo -o my-user -t ghp_12345
`);
}

// Show help if requested or if required params are missing
if (
  parsedArgs.h ||
  parsedArgs.help ||
  !params.repo ||
  !params.owner ||
  (!params.token && !process.env.GITHUB_TOKEN)
) {
  showHelp();
  if (!params.repo)
    console.error("\nError: Repository name (--repo) is required");
  if (!params.owner)
    console.error("Error: Repository owner (--owner) is required");
  if (!params.token && !process.env.GITHUB_TOKEN)
    console.error(
      "Error: GitHub token (--token) is required unless GITHUB_TOKEN env var is set"
    );
  process.exit(1);
}

// Run the main function
getVersion(
  params.repo,
  params.owner,
  params.env,
  params.preRelease,
  params.token
)
  .then((version) => {
    // Output the version to stdout
    console.log(version);
  })
  .catch((error) => {
    console.error("Error:", error.message);
    process.exit(1);
  });
