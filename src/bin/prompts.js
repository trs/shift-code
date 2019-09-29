const {prompt} = require('prompts');
const {GAME_NAMES, PLATFORM_NAMES} = require('../const');

async function promptCredentials() {
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

  return {email, password};
}

async function promptGamePlatform() {
  const {platform, game} = await prompt([
    {
      type: 'select',
      name: 'platform',
      message: 'Platform',
      choices: PLATFORM_NAMES.map((title, value) => ({title, value}))
    },
    {
      type: 'select',
      name: 'game',
      message: 'Game',
      choices: GAME_NAMES.map((title, value) => ({title, value}))
    }
  ]);

  return {platform, game};
}

async function promptContinue() {
  const {cont} = await prompt({
    type: 'toggle',
    name: 'cont',
    message: 'Redeem on different platform or game?',
    initial: false,
    active: 'yes',
    inactive: 'no'
  });
  return {cont};
}

module.exports = {
  promptCredentials,
  promptGamePlatform,
  promptContinue
};
