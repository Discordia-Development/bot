const Command = require('../lib/structures/Command');

class Prefix extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      description: 'See a list of all available bot prefixes.',
      category: 'System',
      usage: 'prefix',
      aliases: ['prefixes']
    });
  }

  async run(message, args) {
    const { prefixes } = this.client.settings.get(message.guild.id);
    const availablePrefixes = prefixes.map(p => `• ${p}`);
    availablePrefixes.push(`• ${this.client.user.toString()}`);

    return message.buildEmbed()
      .setColor(0x4A90E2)
      .setTitle('Available Prefixes')
      .setDescription(availablePrefixes.join('\n'))
      .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
      .send();
  }
}

module.exports = Prefix;