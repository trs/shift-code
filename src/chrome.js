const path = require('path');

function getChromeExecutablePath(executablePath) {
  const isPkg = process.pkg !== 'undefined';

  if (!isPkg) return executablePath;

  if (process.platform === 'win32') {
    return executablePath.replace(
      /^.*?\\node_modules\\puppeteer\\\.local-chromium/,
      path.join(path.dirname(process.execPath), 'chromium')
    );
  } else {
    return executablePath.replace(
      /^.*?\/node_modules\/puppeteer\/\.local-chromium/,
      path.join(path.dirname(process.execPath), 'chromium')
    );
  }
}

module.exports = {
  getChromeExecutablePath
};
