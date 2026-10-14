# Gearbox Shift Code Repo

### Monorepo for Gearbox Shift code automatic redemption

## Usage

You're probably looking for the [command line tool](https://github.com/trs/shift-code/tree/master/cli), which will automatically redeem shift codes for you.

If you're a developer, some of the other packages might interest you in creating your own redemption tool.

## Packages

<table>
  <tr>
    <th align="right">Package</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td align="right"><a href="https://github.com/trs/shift-code/tree/master/cli"><code>@shift-code/cli</code></a></td>
    <td align="left">Command-line tool for redeeming codes</td>
  </tr>
  <tr>
    <td align="right"><a href="https://github.com/trs/shift-code/tree/master/api"><code>@shift-code/api</code></a></td>
    <td align="left">API for interacting with shift website</td>
  </tr>
  <tr>
    <td align="right"><a href="https://github.com/trs/shift-code/tree/master/get"><code>@shift-code/get</code></a></td>
    <td align="left">Library for retrieving shift codes</td>
  </tr>
</table>

## Development

- `yarn install` sets up the workspace and the commit-msg hook
- `yarn build` builds all packages in dependency order
- `yarn dev -- <command>` runs the cli in dev mode, eg: `yarn dev -- redeem`

## Deployment

Releases are automated with [release-please](https://github.com/googleapis/release-please), driven by [conventional commits](https://www.conventionalcommits.org).

- Commit messages, and PR titles for squash merges, must look like `type(scope): subject`
  - scope is optional: `api`, `get`, `cli`, `deps`, `ci`, `release`, `repo`
  - `fix` makes a patch release, `feat` a minor release, and `!` or a `BREAKING CHANGE` footer a major release
  - other types (`chore`, `docs`, `ci`, ...) do not release; to ship a dependency fix, use `fix(deps): ...`
- A commit-msg hook lints commits locally; CI lints PR titles and pushes to `master`
- Pushing releasable commits to `master` opens or updates a release PR with version bumps and changelogs
  - releasing `api` or `get` also releases `cli`
- Merging the release PR triggers the release workflow
  - `api` and `get` are published to NPM and tagged (`@shift-code/<name>@<version>`)
  - `cli` is published to NPM, tagged (`v<version>`), and a Github release is created with the binaries attached
- If a release job fails, re-run the failed jobs; every step is safe to repeat
