#!/usr/bin/env node

import { getVersion } from "./getVersion.js";
import minimist from "minimist";
import { parseArgs } from "node:util";

const [major, minor] = process.version.replace("v", "").split(".");
const MIN_MAJOR = 18;
const MIN_MINOR = 16;
const error =
  "Node version must be a minimum of " +
  "v" +
  MIN_MAJOR +
  "." +
  MIN_MINOR +
  ".0.";

if (Number(major) < MIN_MAJOR) {
  throw new Error(error);
}

if (Number(major) === MIN_MAJOR && Number(minor) < MIN_MINOR) {
  throw new Error(error);
}

let args = minimist(process.argv.slice(2));
let { repo, owner, env, preRelease, token } = args;

if (minor >= 17) {
  const options = {
    repo: {
      type: "string",
      short: "r",
    },
    owner: {
      type: "string",
      short: "o",
    },
    env: {
      type: "string",
      default: "main",
    },
    preRelease: {
      type: "boolean",
      default: false,
    },
    token: {
      type: "string",
      short: "t",
    },
  };

  const {
    values: {
      repo: parsedRepo,
      owner: parsedOwner,
      env: parsedEnv,
      preRelease: parsedPreRelease,
      token: parsedToken,
    },
  } = parseArgs({
    args: process.argv,
    options,
    allowPositionals: true,
  });

  // Use parsed values
  repo = parsedRepo;
  owner = parsedOwner;
  env = parsedEnv;
  preRelease = parsedPreRelease;
  token = parsedToken;
}

function throwError(field) {
  throw new Error("Argument '" + field + "' is required");
}

if (!repo) {
  throwError("repo");
}
if (!owner) {
  throwError("owner");
}
if (!token) {
  throwError("token");
}

// Wrap in IIFE to handle async
(async () => {
  try {
    const result = await getVersion(repo, owner, env, preRelease, token);
    console.log(result);
  } catch (error) {
    console.error("CATCH", error.message, error);
    process.exit(1);
  }
})();
