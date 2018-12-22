const Command = require('../lib/structures/Command');
const { MessageEmbed } = require('discord.js');

class About extends Command {
  constructor(client) {
    super(client, {
      name: 'about',
      description: 'Display information about WikiBot.',
      category: 'System'
    });
  }

  async run(message, args) {
    const embed = new MessageEmbed()
      .setAuthor('About')
      .setDescription('Discord WikiBot is a simple, yet effective tool that grabs articles from the Discord Wiki. It\'s like a nice little wingman that can grab different books for you at the library!\n\n» Want to join us, or just need a hand with getting started using the bot? [Click here.](https://discordapp.com/invite/ZRJ9Ghh)\n» Want to just get started on your own? Try `?articles <article-name>` or `?articles` for the list of articles!\n\n» Use `?servers` for a list of resource servers you can join.\n\n» Use `?commands` to see a full list of the commands!\n\nCan\'t find what you\'re looking for? Try tweeting [@discordapp](https://twitter.com/discordapp) or emailing [support@discordapp.com](https://support.discordapp.com/hc/en-us/requests/new)!\n\n*Developed by OGNovuh#0003*.')
      .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
      .setTimestamp();
    return message.channel.send({ embed });
  }
}

module.exports = About;