const Command = require('../lib/structures/Command');

class Locale extends Command {
  constructor(client) {
    super(client, {
      name: 'locale'
    });
  }

  async run(message, [...newLocale]) {
    const userSettings = await this.client.userSettings.get(message.author.id);
    settings['locale'] = newLocale;
    this.client.userSettings.set(message.author.id, userSettings);

    message.reply(`I've set your locale to \`${newLocale}\`.`);
  }
}

module.exports = Locale;