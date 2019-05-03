const Configstore = require('configstore');
const {name} = require('../package.json');

function keyCacheFactory(username, platform, game) {
  const config = new Configstore(name, {});
  const cacheUser = username.replace(/\W/g, '');

  const masterKey = `${cacheUser}.${game}.${platform}.keys`;

  function getKeyCache() {
    if (!config.has(masterKey)) {
      config.set(masterKey, []);
    }
    return config.get(masterKey);
  }

  function addKeyCache(key) {
    const existingKeys = getKeyCache();
    const newKeys = [...new Set([...existingKeys, key])];
    config.set(masterKey, newKeys);
  }

  return {
    getKeyCache,
    addKeyCache
  };
}

module.exports = {
  keyCacheFactory
};
