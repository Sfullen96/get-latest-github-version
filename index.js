const core = require("@actions/core");
const github = require("@actions/github");
const sortBy = require("lodash/sortBy");
const { octokit } = require("./octokit");

require("dotenv").config();

async function getVersion(repo, owner, env, preRelease, ghToken) {
  try {
    const oct = octokit(ghToken);
    const res = await oct.request(`GET /repos/${owner}/${repo}/releases`);
    const sorted = sortBy(res.data, "created_at").reverse();
    let data = sorted;

    if (!preRelease) {
      data = sorted.filter(({ prerelease }) => !prerelease);
    }
    console.log(data);
    let version = data.filter(
      ({ target_commitish: targetCommitish }) => targetCommitish === env
    )[0]?.name;

    if (!version) {
      version = sorted[0].name;
    }

    if (!version) {
      version = "Unknown";
    }

    core.setOutput("version", version);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    console.log(error);
    core.setFailed(error.message);
  }
}

const repo = core.getInput("repo");
const owner = core.getInput("owner");
const env = core.getInput("environment") || "production";
const preRelease = core.getInput("include-pre-release");
const token = core.getInput("github-token");

getVersion(repo, owner, env, preRelease, token);
