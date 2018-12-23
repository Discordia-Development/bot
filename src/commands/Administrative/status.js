const Command = require('../../lib/structures/Command');
const { Util } = require('discord.js')

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
    const oldPresence = Util.escapeMarkdown(client.user.presence.activity.name);
    await this.client.user.setPresence({ activity: { name: `${args.join(' ')}` } });
    message.reply(`I've set my status from \`${oldPresence}\`to \`${Util.escapeMarkdown(args.join(' '))}\`.`);
  }
}

module.exports = Status;