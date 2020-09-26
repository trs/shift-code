import commander from 'commander';

export function redeemCommand(program: commander.Command) {
  const redeem = program.command('redeem');

  redeem
    .arguments('[codes...]')
    .action(() => {
      console.log('redeem')
    });

  return redeem;
}
