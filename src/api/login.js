const {REDEEM_URL} = require('../const');
const {URL} = require('url');

/**
 * Go to shift login page and login user
 * Continues once page is redirected to account or rewards page
 */
async function authenticateShift(browser, email, password) {
  const page = await browser.newPage();
  try {
    await page.goto(`${REDEEM_URL}/home`);
    await new Promise(async (resolve, reject) => {

      // Enter username and password, click submit
      await page.evaluate(function (_email, _password) {
        document.querySelector('#signin #user_email').value = _email;
        document.querySelector('#signin #user_password').value = _password;
        document.querySelector('#signin .sh_button_primary').click();
      }, email, password);

      page.on('framenavigated', async (event) => {
        const url = new URL(event.url());
        if (url.pathname === '/account' || url.pathname === '/rewards') {
          resolve();
        } else if (url.pathname === '/home') {
          // Error logging in
          const message = await page.$eval('#signin .alert', function (element) {
            return element.innerText;
          });
          reject(message);
        } else {
          reject(`Unknown redirect after login: ${url.pathname}`);
        }
      });
    });
  } finally {
    await page.close();
  }
}

/**
 * Get the logged in user email for cache key
 */
async function getProfileEmail(browser) {
  const page = await browser.newPage();
  try {
    await page.goto(`${REDEEM_URL}/account`);

    const email = await page.$eval('#current_email', function (element) {
      return element.innerText;
    });

    return email;
  } finally {
    await page.close();
  }
}


module.exports = {
  authenticateShift,
  getProfileEmail
};
