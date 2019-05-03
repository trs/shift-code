const {REDEEM_URL} = require('./const');
const {timeout} = require('./helpers');

async function waitForShiftLogin(browser) {
  const page = await browser.newPage();
  try {
    await page.goto(`${REDEEM_URL}/home`);
    await new Promise(async (resolve) => {
      page.on('framenavigated', (event) => {
        const url = event.url();
        if (url.endsWith('/account') || url.endsWith('/rewards')) {
          resolve();
        }
      });
    });
  } finally {
    await page.close();
  }
}

async function redeemShiftKeys(browser, platform, keys = []) {
  async function waitForRedeemButton(page, button) {
    const codeResults = await page.$('#code_results');
    const message = await page.$eval('#code_results', function (element) {
      return element.innerText;
    });

    if (message.match('This SHiFT code has expired')) {
      return;
    }

    if (message.match('Unexpected error occurred')) {
      await timeout(10000);
      await button.click();
      return await waitForRedeemButton();
    }

    const buttons = await codeResults.$$('input[type=submit].redeem_button');
    if (!buttons.length) {
      await timeout(100);
      return await waitForRedeemButton(page);
    }

    for (let button of buttons) {
      const buttonValue = await button.getProperty('value');
      const text = await buttonValue.jsonValue();
      if (text.match(`Redeem for ${platform}`)) return button;
    }

    throw new Error('No Redeem Available!');
  }

  async function redeemShiftKey(key) {
    const page = await browser.newPage();
    try {
      await page.goto(`${REDEEM_URL}/rewards`);

      await page.$eval('input#shift_code_input', function (element, keyStr) {
        element.value = keyStr;
      }, key);

      const button = await page.$('button#shift_code_check');
      await button.click();

      const redeem = await waitForRedeemButton(page, button);
      if (!redeem) return [key, false];

      await redeem.click();

      await new Promise((resolve) => {
        page.on('framenavigated', async (event) => {
          const url = event.url();
          if (url.endsWith('/rewards')) {
            await timeout(1000);
            resolve();
          }
        });
      });

      const message = await page.$eval('div.alert', function (element) {
        return element.innerText;
      });

      if (message.match('To continue to redeem SHiFT codes, please launch a SHiFT-enabled title first!')) {
        throw new Error(message);
      }

      return [key, true];
    } finally {
      await page.close();
    }
  }

  for (const key of keys) {
    await redeemShiftKey(key);
    await timeout(5000);
  }
}

module.exports = {
  waitForShiftLogin,
  redeemShiftKeys
};
