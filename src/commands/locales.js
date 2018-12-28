const Command = require('../lib/structures/Command');

class Locales extends Command {
  constructor(client) {
    super(client, {
      name: 'locales',
      description: 'See a list of all available locales.',
      category: 'System'
    });
  }

  async run(message, args, level) {
    const { locales } = require('../lib/languages/master.json');

    message.reply([
      'This is a list of all available locales.',
      '```asciidoc',
      '== List of Available Locales ==',
      '\n',
      `${locales.map(locale => `${locale.name} :: ${locale.longcode}`.padStart(19)).join('\n')}`,
      '```'
    ]);
  }
}

module.exports = Locales;