const puppeteer = require('puppeteer');
const revision = require('puppeteer/package').puppeteer.chromium_revision;

async function downloadChromium(platform) {
  const browserFetcher = puppeteer.createBrowserFetcher({ platform });
  await browserFetcher.download(revision);
  await browserFetcher.localRevisions(); // TODO: Needed?
}

(async function () {
  await Promise.all([
    downloadChromium('win32'),
    downloadChromium('mac'),
    downloadChromium('linux')
  ]);
})();
