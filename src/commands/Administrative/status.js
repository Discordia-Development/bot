const Command = require('../../lib/structures/Command');
const { Util: { escapeMarkdown } } = require('discord.js');

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
    const oldPresence = this.client.user.presence.activity ? escapeMarkdown(this.client.user.presence.activity.name) : null;
    await this.client.user.setPresence({ activity: { name: `${args.join(' ')}` } });
    if (oldPresence)
      message.reply(`I've set my status from \`${oldPresence}\` to \`${escapeMarkdown(args.join(' '))}\`.`);
    else
      message.reply(`I've set my status to \`${escapeMarkdown(args.join(' '))}\`.`);
  }
}

module.exports = Status;