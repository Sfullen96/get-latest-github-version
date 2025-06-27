# Get latest Github version

This package can be used to get the latest version for a given environment and a given repo.

## Options

- repo | string
  - short = r
  - required
  - The name of the repository to fetch the version for.
  - e.g. `--repo get-latest-github-version`
- owner | string
  - short = 0
  - required
  - The repo owner, e.g. `--owner Sfullen96`. When combined with repo you would get `Sfullen96/get-latest-github-version` as the repo path.
- env | string
  - optional
  - default = "main"
  - This is essentially the git branch you wish to get the latest version for, as the only way to tie a version to an environment on the Github API is via the `target_commitish` property in the API response. This property will be equal to the branch that the tag is attached to. For example, if you wanted the latest alpha version of the repo, provided the branch for that environment is called 'alpha', you would need to pass `--env alpha`. If omitted it will default to the 'main' branch.
- preRelease | boolean
  - optional
  - default = false
  - If true, when working out the latest version the program will factor in pre-release version too. These are versions that have been set to pre-release on Github and are most often used for staging, alpha or beta releases, with a full release being reserved for the main/master branch.
- token | string
  - short = t
  - required
  - The Github access token used to call the Github API. See [https://github.com/settings/tokens](https://github.com/settings/tokens). The token should have the following permissions: `admin:org, admin:public_key, project, repo`
