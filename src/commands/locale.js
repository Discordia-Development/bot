const Command = require('../lib/structures/Command');

class Locale extends Command {
  constructor(client) {
    super(client, {
      name: 'locale',
      description: 'Set your language.',
      category: 'System'
    });
  }

  async run(message, args, level) {
    const userSettings = await this.client.userSettings.get(message.author.id);
    const key = 'locale';

    if (args.length < 1) {
      return message.reply(`your locale is currently set to \`${userSettings.locale}\`.`);
    } else {
      const { locales } = require('../lib/languages/master.json');
      
      const validLocale = locales.find(lang => lang.longcode === args.join(' '));

      if (!validLocale) return message.reply(`The locale \`${args.join(' ')}\` is not a valid locale. Please check your spelling and try again.`);

      userSettings[key] = args.join(' ');
      await this.client.userSettings.set(message.author.id, userSettings);

      return message.reply(`I've set your locale to \`${args.join(' ')}\`.`);
    }
  }
}

module.exports = Locale;