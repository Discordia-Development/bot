const Command = require('../../lib/structures/Command');

class Conf extends Command {
  constructor(client) {
    super(client, {
      name: 'conf',
      permLevel: 'Administrator',
      description: 'Configure server settings.',
      category: 'Administrative',
      usage: 'conf <setting> <option> <value>'
    });
  }

  async run(message, args) {
    const settings = await this.client.settings.get(message.guild.id);

    switch (args[0]) {
      case 'prefix': {
        if (args[1] && args[2]) {
          if (args[1] === 'add') {
            if (settings.prefixes.includes(args[2])) {
              settings.prefixes.push(args[2]);
              message.reply(`I've added this prefix: ${args[2]}`);
            } else {
              message.reply('This prefix already exists.');
            }
          } else if (args[1] === 'remove') {
            if (!settings.prefixes.includes(args[2])) {
              delete settings.prefixes[settings.prefixes.indexOf(args[2])];
              message.reply(`I've removed this prefix: ${args[2]}`);
            } else if ([this.client.user.toString(), `<@!${this.client.user.id}`].includes(args[2])) {
              message.reply('This prefix cannot be removed.');
            } else {
              message.reply('This prefix doesn\'t exist.');
            }
          } else {
            message.reply('Unknown option.');
          }
        } else {
          const { prefixes } = settings;
          const availablePrefixes = prefixes.map(p => `• ${p}`);
          availablePrefixes.push(`• ${this.client.user.toString()}`);
          message.buildEmbed()
            .setColor(0x4A90E2)
            .setTitle('Available Prefixes')
            .setDescription(availablePrefixes.join('\n'))
            .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
            .send();
        }
        break;
      }
      default: {
        const confs = [{
          usage: 'prefix [add|remove] [value]',
          description: 'View, add or remove prefixes.'
        }];

        const usages = confs.map(c => c.usage);
        const longest = usages.reduce((long, str) => Math.max(long, str.length), 0);

        let output = '= Configuration Settings =\n\n';
        confs.forEach(c => {
          output += `${message.prefix}conf ${c.usage}${' '.repeat(longest - c.usage.length)} :: ${c.description}\n`;
        });

        message.channel.send(output, {code:'asciidoc'});
        break;
      }
    }
  }
}

module.exports = Prefix;