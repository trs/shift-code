const puppeteer = require('puppeteer');
const revision = require('puppeteer/package').puppeteer.chromium_revision;

function writeDownloadProgress(downloadBytes, totalBytes) {
  const percent = ((downloadBytes / totalBytes) * 100).toFixed(0);
  process.stdout.write(`${percent}% (${downloadBytes} / ${totalBytes})\r`);
}

async function downloadChromium(platform) {
  console.log(`Downloading Chromium ${revision} (${platform})`);
  const browserFetcher = puppeteer.createBrowserFetcher({ platform });
  await browserFetcher.download(revision, writeDownloadProgress);
  await browserFetcher.localRevisions();
}

(async function () {
  await downloadChromium('win32');
  await downloadChromium('mac');
  await downloadChromium('linux');
})();
