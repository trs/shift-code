#!/bin/node

const {prompt} = require('prompts');
const {Signale} = require('signale');
const puppeteer = require('puppeteer');

const {PLATFORM_CODES, PLATFORM_NAMES, GAMES} = require('./const');

const {timeout} = require('./helpers');
const {fetchShiftKeys} = require('./codes');
const {keyCacheFactory} = require('./cache');
const {waitForShiftLogin, getProfileEmail, redeemShiftKey} = require('./redeem');

(async function() {
  const statusLog = new Signale({
    scope: 'Status',
    interactive: true
  });

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

  statusLog.await('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false
  });

  try {
    statusLog.await('Waiting for login...');
    await waitForShiftLogin(browser);

    statusLog.await('Getting profile email...');
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

    statusLog.complete('Complete!');
  } catch (err) {
    statusLog.error(err);
  } finally {
    await browser.close();
  }
})();
