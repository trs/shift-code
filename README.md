# Borderlands Shift Code Repo

### Monorepo for Borderlands Shift code automatic redemption

## Packages

<table>
  <tr>
    <th align="right">Package</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td align="right"><a href="cli"><code>@shift-code/cli</code></a></td>
    <td align="left">Command-line tool for redeeming codes</td>
  </tr>
  <tr>
    <td align="right"><a href="api"><code>@shift-code/api</code></a></td>
    <td align="left">API for interacting with shift website</td>
  </tr>
  <tr>
    <td align="right"><a href="get"><code>@shift-code/get</code></a></td>
    <td align="left">Library for retrieving shift codes</td>
  </tr>
</table>

## Deployment

- Run `yarn run tag <package>`
  - eg: `yarn run tag cli`
- Enter new version for package
- Version will be changed and a tag will be created
- Tag and commit are then pushed
- Workflow triggers on tag, publishing to NPM and creating a Github release
