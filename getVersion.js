const { octokit } = require("./octokit");

async function getVersion(repo, owner, env, preRelease, ghToken) {
  const oct = octokit(ghToken);
  const res = await oct.request(`GET /repos/${owner}/${repo}/releases`, {
    per_page: 100,
  });

  const sorted = res.data.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b).getTime()
  );
  let data = sorted;

  if (!preRelease) {
    data = sorted.filter(({ prerelease }) => !prerelease);
  }

  let version = data.filter(
    ({ target_commitish: targetCommitish }) => targetCommitish === env
  )[0]?.name;

  if (!version) {
    version = sorted[0].name;
  }

  if (!version) {
    version = "Unknown";
  }

  process.stdout.write(version + "\n");
  return version;
}

module.exports = { getVersion };
