const {CODES_URL} = require('../const');

async function getShiftCodes(browser, platform, game) {
  const page = await browser.newPage();
  try {
    await page.goto(`${CODES_URL}/${game}`);

    const rowSelector = 'table tbody#codeTable tr';

    const codeCells = await page.$$(`${rowSelector} td.cell-${platform}, ${rowSelector} td.cell-uv`);

    const codes = new Set();
    for (const cell of codeCells) {
      const code = await cell.$eval('span', (element) => element.innerHTML.trim());
      codes.add(code);
    }
    
    return codes;
  } finally {
    await page.close();
  }
}

module.exports = {
  getShiftCodes
};
