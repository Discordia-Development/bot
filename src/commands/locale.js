const Command = require('../lib/structures/Command');

class Locale extends Command {
  constructor(client) {
    super(client, {
      name: 'locale'
    });
  }

  async run(message, [...newLocale]) {
    const key = 'locale';

    const userSettings = await this.client.userSettings.get(message.author.id);
    userSettings[key] = newLocale.toString();
    await this.client.userSettings.set(message.author.id, userSettings);

    message.reply(`I've set your locale to \`${newLocale}\`.`);
  }
}

module.exports = Locale;