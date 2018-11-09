const Command = require('../lib/structures/Command.js');
const exec = require('child_process').exec;

class Exec extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      description: 'Executes a new process, very dangerous.',
      usage: 'exec <expression:string>',
      aliases: ['shell'],
      category: 'Owner',
      extended: 'This will spawn a child process and execute the given command.',
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) {
    exec(`${args.join(' ')}`, (error, stdout) => {
      const response = (error || stdout);
      message.channel.send(`Ran: ${message.content}\n\`\`\`${response}\`\`\``, {
        split: true
      }).catch(console.error);
    });
  }
}

module.exports = Exec;