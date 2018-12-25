const Command = require('../lib/structures/Command');
const fs = require('fs-nextra');

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
      const locales = await fs.readJSON(`${process.cwd()}/src/lib/languages/master.json`);
      console.log(locales);
      
      for (const locale in locales) {
        console.log(locale[longcode]);
      }

      return message.reply(`your locale is currently set to \`${userSettings.locale}\`.`);
    } else {
      userSettings[key] = args.join(' ');
      await this.client.userSettings.set(message.author.id, userSettings);

      return message.reply(`I've set your locale to \`${args.join(' ')}\`.`);
    }
  }
}

module.exports = Locale;