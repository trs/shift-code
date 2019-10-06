const yargs = require("yargs");
const { GAME_NAMES, PLATFORM_NAMES } = require("../const");

module.exports = () => {
  return yargs
    .options({
      email: {
        describe: "Shift Username"
      },
      password: {
        describe: "Shift Password"
      },
      platform: {
        describe: "Platform",
        choices: PLATFORM_NAMES
      },
      game: {
        describe: "Game",
        choices: GAME_NAMES
      }
    })
    .help().argv;
};
