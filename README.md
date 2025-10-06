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

## Deployment

- Run `yarn run tag <package> <strategy>`
  - eg: `yarn run tag cli minor`
- Version will be changed and a tag will be created
- Tag and commit are then pushed
- Workflow triggers on tag, publishing to NPM and creating a Github release
