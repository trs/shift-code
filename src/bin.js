#!/usr/bin/env node

const {prompt} = require('prompts');
const {Signale} = require('signale');
const puppeteer = require('puppeteer');

const {PLATFORM_CODES, PLATFORM_NAMES, GAMES, CACHE_KEYS} = require('./const');

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

  // Launch a headless browser to do the shift code requests
  const browser = await puppeteer.launch({
    executablePath,
    headless: true
  });

  statusLog.success('Login to your SHiFT account:');

  try {
    // Prompt for username and password
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

    // Attempt to login to the given shift account
    await waitForShiftLogin(browser, email, password);

    // We start a loop here so we can redeem multiple games/platforms without having to login again
    let redeem = true;
    while (redeem) {
      // Prompt for the game platform
      const {platformIndex} = await prompt({
        type: 'select',
        name: 'platformIndex',
        message: 'Platform',
        choices: [
          { title: 'Steam', value: 0 },
          { title: 'PSN', value: 1 },
          { title: 'Xbox Live', value: 2 },
          { title: 'Epic', value: 3 }
        ],
      });
      if (platformIndex === undefined) return;

      // platformCode is used by the shift code website, corresponding to the div selector
      const platformCode = PLATFORM_CODES[platformIndex];
      // platformName is used by the shift redeem website, corresponding to which button to click when redeeming
      const platformName = PLATFORM_NAMES[platformIndex];
      // cacheKey is used by the app to store which keys have already been used
      const cacheKey = CACHE_KEYS[platformIndex];

      // Prompt for the game
      const {gameIndex} = await prompt({
        type: 'select',
        name: 'gameIndex',
        message: 'Game',
        choices: [
          { title: 'Borderlands GOTY', value: 0 },
          { title: 'Borderlands 2', value: 1 },
          { title: 'Borderlands: The Pre-Sequel', value: 2 },
          { title: 'Borderlands 3', value: 3 }
        ],
      });
      if (gameIndex === undefined) return;

      // game is used by the shift code website, corresponding to which URL to go to for codes
      const game = GAMES[gameIndex];

      console.log(); // Add blank line to maintain previous line in log

      statusLog.await('Preparing...');
      // Grab the users email address
      const user = await getProfileEmail(browser);

      // Setup our key cache to store used keys
      const {getKeyCache, addKeyCache} = keyCacheFactory(user, cacheKey, game);

      statusLog.await('Fetching keys...');
      // Grab a list of keys from the shift code website
      const fetchedKeys = await fetchShiftKeys(browser, platformCode, game);

      statusLog.await('Loading key cache...');
      // Load the cached keys so we can ignore codes already applied
      const usedKeys = getKeyCache();

      statusLog.await('Redeeming keys...');
      
      // Redeem each key 1 at a time
      for (let key of fetchedKeys) {
        const keyLog = new Signale({
          scope: key,
          interactive: true
        });
        keyLog.await('Redeeming key...');

        if (!usedKeys.includes(key)) {
          // Redeem the code from the shift website
          const [redeemed, message] = await redeemShiftKey(browser, platformName, key);
          if (!redeemed) {
            keyLog.error(message);
          } else {
            keyLog.success(message);
          }

          // Cache the key so we don't try to redeem it again
          addKeyCache(key);

          await timeout(500);
        } else {
          keyLog.note('Key found in cache, skipped');
        }
        console.log(); // Add blank line to maintain previous line in log
      }

      statusLog.complete('Redeemed all keys!');

      // Ask if we should redeem again
      const {cont} = await prompt({
        type: 'toggle',
        name: 'cont',
        message: 'Redeem again on another platform or game?',
        initial: false,
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
