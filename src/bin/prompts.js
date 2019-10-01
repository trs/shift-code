const {prompt} = require('prompts');
const {GAME_NAMES, GAME_ARGS, PLATFORM_NAMES, PLATFORM_ARGS} = require('../const');
const {Signale} = require('signale');

const statusLog = new Signale({interactive: true});
const argv = require('minimist')(process.argv.slice(2));

async function promptCredentials() {
  if ( argv['email'] && argv['password'] ) {
      var email = argv['email'];
      var password = argv['password']; 
  } else {
    statusLog.success('Login to your SHiFT account:');

    var {email, password} = await prompt([
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
  }

  return {email, password};
}

async function promptGamePlatform() {
  if ( argv['platform'] ) {
    var platform = PLATFORM_ARGS.indexOf(argv['platform']);
  } else {
    var {platform} = await prompt([
      {
        type: 'select',
        name: 'platform',
        message: 'Platform',
        choices: PLATFORM_NAMES.map((title, value) => ({title, value}))
      }
    ]);
  }
  
  if ( argv['games'] ) {
    var game = GAME_ARGS.indexOf(argv['games'].toString());
    statusLog.await(`Checking ${GAME_NAMES[game]} on ${PLATFORM_NAMES[platform]}`);
  } else {
    var {game} = await prompt([
      {
        type: 'select',
        name: 'game',
        message: 'Game',
        choices: GAME_NAMES.map((title, value) => ({title, value}))
      }
    ]);
  }

  return {platform, game};
}

async function promptContinue() {
  if (argv['games'] || argv['platform']) {
    var {cont} = false;
  } else {
    var {cont} = await prompt({
      type: 'toggle',
      name: 'cont',
      message: 'Redeem on different platform or game?',
      initial: false,
      active: 'yes',
      inactive: 'no'
    });
  }
  return {cont};
}

module.exports = {
  promptCredentials,
  promptGamePlatform,
  promptContinue
};
