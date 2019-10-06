const {prompt} = require('prompts');
const {GAME_NAMES, PLATFORM_NAMES} = require('../const');

async function promptUnknown(questions = [], defaultOptions = {}) {
  const filteredQuestions = questions.filter(
    question => !defaultOptions[question.name]
  );

  const promptedAnswers = await prompt(filteredQuestions);

  return questions.reduce((answers, question) => {
    const {name} = question;
    answers[name] = promptedAnswers[name] || defaultOptions[name];
    return answers;
  }, {});
}

function getIndex(prop, propList) {
  if (typeof prop === 'string') {
    return propList.indexOf(prop);
  }
  return prop;
}

async function promptCredentials(defaultOptions) {
  return promptUnknown(
    [
      {
        type: 'text',
        name: 'email',
        initial: defaultOptions.email,
        message: 'Shift Email'
      },
      {
        type: 'password',
        name: 'password',
        initial: defaultOptions.password,
        message: 'Shift Password'
      }
    ],
    defaultOptions
  );
}

async function promptGamePlatform(defaultOptions) {
  const {platform, game} = await promptUnknown(
    [
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
    ],
    defaultOptions
  );
  return {
    platform: getIndex(platform, PLATFORM_NAMES),
    game: getIndex(game, GAME_NAMES)
  };
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
