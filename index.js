#!/usr/bin/env node

const { parseArgs } = require("node:util");
const { getVersion } = require("./getVersion");

const [major, minor] = process.version.replace("v", "").split(".");
const MIN_MAJOR = 16;
const MIN_MINOR = 17;
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

const args = process.argv;
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

function throwError(field) {
  throw new Error("Argument '" + field + "' is required");
}

const {
  values: { repo, owner, env, preRelease, token },
} = parseArgs({
  args,
  options,
  allowPositionals: true,
});

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
