const path = require('path');
const puppeteer = require('puppeteer');

function getChromeExecutablePath(executablePath) {
  const isPkg = typeof process.pkg !== 'undefined';

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

async function launchBrowser() {
  // Workaround for pkg
  const executablePath = getChromeExecutablePath(puppeteer.executablePath());

  // Launch a headless browser to do the shift code requests
  const browser = await puppeteer.launch({
    executablePath,
    headless: true
  });
  return browser;
}

module.exports = {
  getChromeExecutablePath,
  launchBrowser
};
