const {REDEEM_URL} = require('../const');
const {timeout} = require('../helpers');

/** Wait for the redeem button to appear */
async function waitForRedeemButton(page, platform, checkButton) {
  const codeResults = await page.$('#code_results');
  const message = await page.$eval('#code_results', function (element) {
    return element.innerText.trim();
  });

  if (message.match('This is not a valid SHiFT code')) {
    return [undefined, message];
  }

  if (message.match('This SHiFT code has expired')) {
    return [undefined, message];
  }

  if (message.match('This code is not available for your account')) {
    return [undefined, message];
  }

  // Too many requests, wait and try again
  if (message.match('Unexpected error occurred')) {
    await timeout(5000);
    await checkButton.click();
    return await waitForRedeemButton(page, platform, checkButton);
  }

  // Get all redeem buttons
  const buttons = await codeResults.$$('input[type=submit].redeem_button');
  if (!buttons.length) {
    // Check hasn't loaded buttons yet
    await timeout(100);
    return await waitForRedeemButton(page, platform, checkButton);
  }

  // Find the correct platform's button
  let redeemButton = undefined;
  for (let button of buttons) {
    const buttonValue = await button.getProperty('value');
    const text = await buttonValue.jsonValue();
    if (text.match(`Redeem for ${platform}`)) {
      redeemButton = button;
      break;
    };
  }

  if (!redeemButton) {
    return [undefined, 'Cannot redeem code for platform'];
  }

  return [redeemButton, message];
}

/**
 * Attempt to redeem a shift key
 */
async function redeemShiftCode(browser, platform, key) {
  const page = await browser.newPage();
  try {
    await page.goto(`${REDEEM_URL}/rewards`);

    await page.$eval('input#shift_code_input', function (element, keyStr) {
      element.value = keyStr;
    }, key);

    const checkButton = await page.$('button#shift_code_check');
    await checkButton.click();

    const [redeemButton, redeemMessage] = await waitForRedeemButton(page, platform, checkButton);
    if (!redeemButton) return [false, redeemMessage];

    await redeemButton.click();

    await new Promise((resolve) => {
      // Wait for page to navigate back to rewards page
      page.on('framenavigated', async (event) => {
        const url = event.url();
        if (url.endsWith('/rewards')) {
          await timeout(1000);
          resolve();
        }
      });
    });

    // Get result of key
    const resultMessage = await page.$eval('div.alert', function (element) {
      return element.innerText;
    });

    if (resultMessage.match('To continue to redeem SHiFT codes, please launch a SHiFT-enabled title first!')) {
      throw new Error(resultMessage);
    }

    const redeemed = !!resultMessage.match('Your code was successfully redeemed');
    return [redeemed, resultMessage];
  } finally {
    await page.close();
  }
}

module.exports = {
  redeemShiftCode
};
