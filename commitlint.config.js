// Keep the scope list in sync with the `scopes` input in .github/workflows/ci.yml
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['api', 'get', 'cli', 'deps', 'ci', 'release', 'repo']],
  },
};
