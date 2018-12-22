const Command = require('../lib/structures/Command');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      permLevel: 'Administrator'
    });
  }

  async run(message, args) {
    const key = 'prefix';
    const newPrefix = ['new prefix', 'a new', 'a new one', 'new'];
    const resetPrefix = ['reset prefix', 'reset'];

    const settings = await this.client.settings.get(message.guild.id);

    if (!args[0]) {
      message.channel.startTyping();
      const response = await this.client.awaitReply(message, 'Would you like to reset the prefix or set a new prefix?');
      message.channel.stopTyping();

      if (newPrefix.includes(response)) {
        const res = await this.client.awaitReply(message, 'What would you like the new prefix to be?');
        settings[key] = res;
        
        this.client.settings.set(message.guild.id, settings);
        await message.reply(`I've set the prefix to \`${res}\``);
      } else if (resetPrefix.includes(response)) {
        settings[key] = 'wikibot, ';
        
        this.client.settings.set(message.guild.id, settings);
        await message.reply('I\'ve reset the prefix to `wikibot, `.');
      }
    }
  }
}

module.exports = Prefix;