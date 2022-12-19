const { Octokit } = require("@octokit/rest");
require("dotenv").config();

function octokit(token) {
  return new Octokit({
    auth: token || process.env.GITHUB_TOKEN,
  });
}

module.exports = { octokit };
