#!/usr/bin/env node

const {Signale} = require('signale');

const {launchBrowser} = require('./chrome');
const {promptCredentials, promptGamePlatform, promptContinue} = require('./prompts');
const {codeCacheFactory} = require('./cache');
const {getShiftCodes, authenticateShift, redeemShiftCode} = require('../api');
const {PLATFORM_CODES, PLATFORM_NAMES, CACHE_KEYS, GAME_NAMES, GAME_CODES} = require('../const');

const statusLog = new Signale({interactive: true});

(async function () {
  statusLog.await('Launching...');

  const browser = await launchBrowser();

  try {

    // Authenticate user
    const {email, password} = await promptCredentials();
    if (email === undefined || password === undefined) throw new Error('Required.');

    console.log(); // Add blank line to maintain previous line in log

    statusLog.await('Authenticating with SHiFT...');
    await authenticateShift(browser, email, password);

    // Continue prompting for games until complete
    while (true) {
      statusLog.success('Select SHiFT eligible game:');

      // Prompt for game
      const {platform, game} = await promptGamePlatform();
      if (platform === undefined || game === undefined) {
        const {cont} = await promptContinue();
        if (!cont) break;
        else continue;
      }

      // platformKey is used by the shift code website, corresponding to the div selector
      const platformKey = PLATFORM_CODES[platform];
      // platformName is used by the shift redeem website, corresponding to which button to click when redeeming
      const platformName = PLATFORM_NAMES[platform];
      // cacheKey is used by the app to store which keys have already been used
      const cacheKey = CACHE_KEYS[platform];

      // shiftGame is used by the shift code website, corresponding to which URL to go to for codes
      const shiftGame = GAME_CODES[game];

      const gameName = GAME_NAMES[game];

      const gameLog = new Signale({interactive: true, scope: gameName});

      console.log();
      gameLog.await('Preparing...');
      const codeCache = codeCacheFactory(email, cacheKey, shiftGame);

      gameLog.await('Loading SHiFT codes...');
      const shiftCodes = await getShiftCodes(browser, platformKey, shiftGame);

      const totalCount = shiftCodes.size;

      gameLog.complete(`SHiFT codes: ${totalCount}`);
      console.log();

      let redeemCount = 0;
      for (const code of shiftCodes) {
        const codeLog = new Signale({scope: code, interactive: true});

        codeLog.await('Redeeming SHiFT code...');

        if (!codeCache.has(code)) {
          try {
            // Redeem the code from the shift website
            const [redeemed, message] = await redeemShiftCode(browser, platformName, code);
            if (!redeemed) {
              codeLog.error(message);
            } else {
              codeLog.success(message);
              redeemCount++;
            }

            // Cache the key so we don't try to redeem it again
            codeCache.add(code);
          } catch (err) {
            codeLog.error(err);
            break;
          }
        } else {
          codeLog.note('Key found in cache, skipped');
        }
        console.log();
      }

      gameLog.success(`Redemed ${redeemCount} SHiFT codes!`);
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
