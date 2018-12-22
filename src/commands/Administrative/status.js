const Command = require('../../lib/structures/Command');

class Status extends Command {
  constructor(client) {
    super(client, {
      name: 'status',
      permLevel: 'Bot Admin',
      description: 'Set the bot\'s presence status.',
      category: 'Administrative'
    });
  }

  async run(message, args, level) {
    await this.client.user.setPresence({ activity: { name: `${args.join(' ')}` } });
    message.reply(`I've set my status to \`${args.join(' ')}\`.`);
  }
}

module.exports = Status;