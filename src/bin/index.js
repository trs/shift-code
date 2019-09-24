#!/usr/bin/env node

const {Signale} = require('signale');

const {launchBrowser} = require('./chrome');
const {promptCredentials, promptGamePlatform, promptContinue} = require('./prompts');
const {codeCacheFactory} = require('./cache');
const {getShiftCodes, authenticateShift, redeemShiftCode} = require('../api');
const {PLATFORM_CODES, PLATFORM_NAMES, CACHE_KEYS, GAMES} = require('../const');

const statusLog = new Signale({interactive: true});

(async function () {
  statusLog.await('Launching...');
  
  const browser = await launchBrowser();

  try {
    statusLog.success('Login to your SHiFT account:');

    // Authenticate user
    const {email, password} = await promptCredentials();
    
    console.log(); // Add blank line to maintain previous line in log

    statusLog.await('Authenticating with SHiFT...');
    await authenticateShift(browser, email, password);

    // Continue prompting for games until complete
    while (true) {
      statusLog.success('Select SHiFT eligible game:');

      // Prompt for game
      const {platform, game} = await promptGamePlatform();

      // platformKey is used by the shift code website, corresponding to the div selector
      const platformKey = PLATFORM_CODES[platform];
      // platformName is used by the shift redeem website, corresponding to which button to click when redeeming
      const platformName = PLATFORM_NAMES[platform];
      // cacheKey is used by the app to store which keys have already been used
      const cacheKey = CACHE_KEYS[platform];

      // shiftGame is used by the shift code website, corresponding to which URL to go to for codes
      const shiftGame = GAMES[game];

      console.log();
      statusLog.await('Preparing...');
      const codeCache = codeCacheFactory(email, cacheKey, shiftGame);

      statusLog.await('Loading SHiFT codes...');
      const shiftCodes = await getShiftCodes(browser, platformKey, shiftGame);

      for (const code of shiftCodes) {
        const codeLog = new Signale({scope: code, interactive: true});

        codeLog.await('Redeeming SHiFT code...');
        
        if (!codeCache.has(code)) {
          // Redeem the code from the shift website
          const [redeemed, message] = await redeemShiftCode(browser, platformName, code);
          if (!redeemed) {
            codeLog.error(message);
          } else {
            codeLog.success(message);
          }

          // Cache the key so we don't try to redeem it again
          codeCache.add(code);
        } else {
          codeLog.note('Key found in cache, skipped');
        }
        console.log();
      }

      statusLog.success('Redemption successful!');
      const {cont} = await promptContinue();
      if (!cont) break;
    }
  } catch (err) {
    statusLog.error(err);
  } finally {
    await browser.close();
  }
})()
.catch((err) => {
  statusLog.fatal(err);
});
