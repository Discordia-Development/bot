const Command = require('../lib/structures/Command');

class Locale extends Command {
  constructor(client) {
    super(client, {
      name: 'locale'
    });
  }

  async run(message, args, level) {
    const userSettings = await this.client.userSettings.get(message.author.id);
    const key = 'locale';

    if (args.length < 1) {
      message.reply(`your locale is currently set to \`${userSettings.locale}\`.`);
      return await message.delete({ timeout: 5000 });
    } else {
      userSettings[key] = args.join(' ');
      await this.client.userSettings.set(message.author.id, userSettings);
  
      message.reply(`I've set your locale to \`${args.join(' ')}\`.`);
      await message.delete({ timeout: 5000 });
    }
  }
}

module.exports = Locale;