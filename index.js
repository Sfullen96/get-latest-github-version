import core from "@actions/core";
import github from "@actions/github";
import sortBy from "lodash/sortBy";
import octokit from "./octokit";

try {
  const repo = core.getInput("repo");
  const owner = core.getInput("owner");
  const env = core.getInput("environment") || "production";
  const preRelease = core.getInput("include-pre-release");

  const res = await octokit.request(`GET /repos/${owner}/${repo}/releases`);
  const sorted = sortBy(res.data, "created_at").reverse();

  let data = sorted;

  if (!preRelease) {
    data = sorted.filter(({ prerelease }) => !prerelease);
  }

  const version = data.filter(
    ({ target_commitish: targetCommitish }) => targetCommitish === env
  )[0]?.name;

  core.setOutput("version", version);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  console.log(error);
  core.setFailed(error.message);
}
