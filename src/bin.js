#!/usr/bin/env node

const {prompt} = require('prompts');
const {Signale} = require('signale');
const puppeteer = require('puppeteer');

const {PLATFORM_CODES, PLATFORM_NAMES, GAMES} = require('./const');

const {getChromeExecutablePath} = require('./chrome');
const {timeout} = require('./helpers');
const {fetchShiftKeys} = require('./codes');
const {keyCacheFactory} = require('./cache');
const {waitForShiftLogin, getProfileEmail, redeemShiftKey} = require('./redeem');

(async function() {
  const statusLog = new Signale({
    scope: 'Status',
    interactive: true
  });

  statusLog.await('Launching...');

  // Workaround for pkg
  const executablePath = getChromeExecutablePath(puppeteer.executablePath());

  const browser = await puppeteer.launch({
    executablePath,
    headless: true
  });

  try {
    const {email, password} = await prompt([
      {
        type: 'text',
        name: 'email',
        message: 'Shift Email'
      },
      {
        type: 'password',
        name: 'password',
        message: 'Shift Password'
      }
    ]);
    if (email === undefined) return;
    if (password === undefined) return;

    await waitForShiftLogin(browser, email, password);

    let redeem = true;
    while (redeem) {
      const {platformIndex} = await prompt({
        type: 'select',
        name: 'platformIndex',
        message: 'Platform',
        choices: [
          { title: 'PC', value: 0 },
          { title: 'Playstation', value: 1 },
          { title: 'Xbox', value: 2 },
        ],
      });
      if (platformIndex === undefined) return;

      const platformCode = PLATFORM_CODES[platformIndex];
      const platformName = PLATFORM_NAMES[platformIndex];

      const {gameIndex} = await prompt({
        type: 'select',
        name: 'gameIndex',
        message: 'Game',
        choices: [
          { title: 'Borderlands GOTY', value: 0 },
          { title: 'Borderlands 2', value: 1 },
          { title: 'Borderlands: The Pre-Sequel', value: 2 }
        ],
      });
      if (gameIndex === undefined) return;

      const game = GAMES[gameIndex];

      statusLog.await('Preparing...');
      const user = await getProfileEmail(browser);

      const {getKeyCache, addKeyCache} = keyCacheFactory(user, platformCode, game);

      statusLog.await('Fetching keys...');
      const fetchedKeys = await fetchShiftKeys(browser, platformCode, game);

      statusLog.await('Loading key cache...');
      const usedKeys = getKeyCache();

      statusLog.await('Redeeming keys...');

      for (let key of fetchedKeys) {
        const keyLog = new Signale({
          scope: key,
          interactive: true
        });
        keyLog.await('Redeeming key...');

        if (!usedKeys.includes(key)) {
          const [redeemed, message] = await redeemShiftKey(browser, platformName, key);
          if (!redeemed) {
            keyLog.error(message);
          } else {
            keyLog.success(message);
          }

          addKeyCache(key);

          await timeout(1000);
        } else {
          keyLog.note('Key found in cache, skipped')
        }
      }

      statusLog.complete('Redeemed all keys!');

      const {cont} = await prompt({
        type: 'toggle',
        name: 'cont',
        message: '\nRedeem again on another platform?',
        initial: true,
        active: 'yes',
        inactive: 'no'
      });
      redeem = cont;
    }
  } catch (err) {
    statusLog.error(err);
  } finally {
    await browser.close();
  }
})();
