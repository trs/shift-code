const {CODES_URL} = require('./const');

async function fetchShiftKeys(browser, game, platform) {
  const page = await browser.newPage();
  try {
    await page.goto(`${CODES_URL}/${game}`);

    const tableSelector = 'table tbody#codeTable tr';
    const keyElements = await page.$$(`${tableSelector} td.cell-${platform}, ${tableSelector} td.cell-uv`);

    const keys = [];
    for (const keyElement of keyElements) {
      const key = await keyElement.$eval('span', (element) => {
        return element.innerHTML
      });
      keys.push(key);
    }
    return keys;
  } finally {
    await page.close();
  }
}

module.exports = {
  fetchShiftKeys
};
