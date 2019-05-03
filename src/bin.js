#!/bin/node

const {prompt} = require('prompts');
const {Signale} = require('signale');
const puppeteer = require('puppeteer');

const {PLATFORM_CODES, PLATFORM_NAMES, GAMES} = require('./const');

const {fetchShiftKeys} = require('./codes');
const {waitForShiftLogin, redeemShiftKeys} = require('./redeem');

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
  const game = GAMES[gameIndex];

  statusLog.await('Launching browser...');
  const browser = await puppeteer.launch({
    headless: false
  });

  try {
    statusLog.await('Waiting for login...');
    await waitForShiftLogin(browser);

    statusLog.await('Fetching keys...');
    const keys = await fetchShiftKeys(browser, game, platformCode);

    statusLog.await('Redeeming keys...');
    await redeemShiftKeys(browser, platformName, keys);

    statusLog.success('Complete!');
  } catch (err) {
    statusLog.error('Error', err);
  } finally {
    await browser.close();
  }
})();
