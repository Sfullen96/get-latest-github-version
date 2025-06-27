import { Octokit } from "@octokit/rest";
import "dotenv/config";

function octokit(token) {
  return new Octokit({
    auth: token || process.env.GITHUB_TOKEN,
  });
}

export { octokit };
