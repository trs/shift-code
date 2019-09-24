const {prompt} = require('prompts');

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
      choices: [
        { title: 'Steam', value: 0 },
        { title: 'PSN', value: 1 },
        { title: 'Xbox Live', value: 2 },
        { title: 'Epic', value: 3 }
      ],
    },
    {
      type: 'select',
      name: 'game',
      message: 'Game',
      choices: [
        { title: 'Borderlands GOTY', value: 0 },
        { title: 'Borderlands 2', value: 1 },
        { title: 'Borderlands: The Pre-Sequel', value: 2 },
        { title: 'Borderlands 3', value: 3 }
      ],
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
