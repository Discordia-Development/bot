const Command = require('../lib/structures/Command');
const servers = require('../lib/info/servers');

class Servers extends Command {
  constructor(client) {
    super(client, {
      name: 'servers',
      aliases: ['server'],
      description: 'Display a list of helpful Discord servers.',
      category: 'Main',
      usage: 'servers'
    });
  }

  async run(message, [...server], level) {
    /*
    TODO: Implement in later commit.
    
    const eventKeys = ['events', 'devents', 'discord events'];
    const wikiKeys = ['discordia', 'discord wiki', 'wiki'];
    const testerKeys = ['discord testers', 'dtesters', 'testers'];
    const apiKeys = ['discord api', 'dapi', 'api'];
    const botKeys = ['discord bots', 'dbots', 'bots'];
    const linuxKeys = ['discord linux', 'dlinux', 'linux'];

    if (eventKeys.includes(server)) return;
    if (wikiKeys.includes(server)) return;
    if (testerKeys.includes(server)) return;
    if (apiKeys.includes(server)) return;
    if (botKeys.includes(server)) return;
    if (linuxKeys.includes(server)) return;
    */

    const list = servers.map(s => `[${s.title}](https://discord.gg/${s.invite})`).join('\n');
    message.buildEmbed()
      .setTitle('Available Servers')
      .setDescription(`${list}\n\nCan't find what you're looking for? Ask for help [here](https://discord.gg/ZRJ9Ghh)!`)
      .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
      .setTimestamp()
      .setColor(0x4A90E2)
      .send();
  }
}

module.exports = Servers;