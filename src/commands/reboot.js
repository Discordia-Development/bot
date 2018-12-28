const Command = require('../lib/structures/Command.js');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);


class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Restart the bot.',
      category: 'System',
      usage: 'reboot',
      aliases: ['restart', 'die'],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) { 
    try {
      await message.reply('Bot is shutting down.');
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;