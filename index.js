#!/usr/bin/env node

const { getVersion } = require("./getVersion");

const [major, minor] = process.version.replace("v", "").split(".");
const MIN_MAJOR = 16;
const MIN_MINOR = 15;
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

let args = require("minimist")(process.argv.slice(2));
const { repo } = args;
const { owner } = args;
const { env } = args;
const { preRelease } = args;
const { token } = args;

if (minor >= 17) {
  const { parseArgs } = require("node:util");

  args = process.argv;
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
    values: { repo, owner, env, preRelease, token },
  } = parseArgs({
    args,
    options,
    allowPositionals: true,
  });
}

function throwError(field) {
  throw new Error("Argument '" + field + "' is required");
}

if (!repo) {
  return throwError("repo");
}
if (!owner) {
  return throwError("owner");
}
if (!token) {
  return throwError("token");
}

return getVersion(repo, owner, env, preRelease, token);
