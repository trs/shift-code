const Configstore = require('configstore');
const {name} = require('../../package.json');

function codeCacheFactory(email, platform, game) {
  const config = new Configstore(name, {});
  const cacheUser = email.toLocaleLowerCase().replace(/\W/g, '');

  const masterKey = `${cacheUser}.${game}.${platform}.keys`;

  if (!config.has(masterKey)) {
    config.set(masterKey, []);
  }
  const codes = new Set(config.get(masterKey));

  function has(code) {
    return codes.has(code);
  }

  function add(code) {
    codes.add(code);
    config.set(masterKey, [...codes.values()]);
  }

  return {
    has,
    add
  };
}

module.exports = {
  codeCacheFactory
};
