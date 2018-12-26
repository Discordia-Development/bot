const Command = require('../../lib/structures/Command');
const exec = require('child_process').exec;

class Log extends Command {
  constructor(client) {
    super(client, {
      name: 'log'
    });
  }

  async run(message, args, level) {
    exec('git log', (error, stdout) => {
      message.channel.send([
        `Wikibot is on commit ${stdout.split('\n')[0].split(' ')[1]}`,
        `Commit was signed by ${stdout.split('\n')[1].split(' ')[1]} ${stdout.split('\n')[1].split(' ')[2]}`,
        `Commit was pushed on ${stdout.split('\n')[2].split('   ')[1]}`
      ]);
    });
  }
}

module.exports = Log;