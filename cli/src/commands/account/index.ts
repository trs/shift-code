import meow from 'meow';

export default function () {
  const cli = meow(`
  Manage shift accounts

  Usage
    $ shift-code account login
    $ shift-code account logout
    $ shift-code account list
    $ shift-code account cache
  `, {

  });

  switch (cli.input[1]) {
    default:
      cli.showHelp();
      break;
  }
}
