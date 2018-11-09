const Command = require('../lib/structures/Command');

const { MessageEmbed } = require('discord.js');

const snek = require('snekfetch');

const requests = new Map();

class Helpdesk extends Command {
  constructor(client) {
    super(client, {
      name: 'helpdesk'
    });
  }

  async run(message, args) {
    const query = args.join(' ');
    const match = /(?:helpdesk|hd)\s+(.+)/i.exec(message.content);

    if (!match) {
      message.buildEmbed()
        .setTitle('Invaid Query')
        .setDescription('Please provide a valid search query to search on the HelpDesk. `wikibot, helpdesk <query>`')
        .setColor(0x99AAB5)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
      await message.delete({ timeout: 5000 });
    }
    
    const query2 = match[1];
    const encodedQuery = encodeURI(query2);

    requests.set(message.createdTimestamp, setTimeout(() => requests.delete(message.createdTimestamp), 60000));

    const cachedQuery = await this.client.redis.get(query);
    if (!cachedQuery) {
      snek.get(`https://support.discordapp.com/api/v2/help_center/search.json?query=${encodedQuery}`).then(async res => {
        if (res.status !== 200) {
          this.client.sentry.captureException();
        }

        const body = res.body;
        const top = body.results.slice(0, 5);
        const list = top.map(r => `» [${r.title}](${r.html_url})`).join('\n');

        if (!top.length) {
          message.buildEmbed()
            .setTitle('Discord HelpDesk : No Results')
            .setDescription(`No results came back from the query **${query.length > 40 ? query.substring(0, 36) + '...' : query}**.\n\nCan't find what you're looking for? Try tweeting [@discordapp](https://twitter.com/discordapp) or emailing [support@discordapp.com](https://support.discordapp.com/hc/en-us/requests/new)!`)
            .setColor(0x4A90E2)
            .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
            .send();
          await message.delete({ timeout: 5000 });
        } 

        const embed = new MessageEmbed()
          .setTitle('Discord HelpDesk : Top Results')
          .setDescription(`${list}\n\nCan't find what you're looking for? Try tweeting [@discordapp](https://twitter.com/discordapp) or emailing [support@discordapp.com](https://support.discordapp.com/hc/en-us/requests/new)!`)
          .setColor(0x4A90E2)
          .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png');
        message.channel.send({ embed });
        await message.delete({ timeout: 5000 });

        await this.client.redis.set(query, list);
      });
    } else {
      const embed = new MessageEmbed()
        .setTitle('Discord HelpDesk : Top Results')
        .setDescription(`${cachedQuery}\n\nCan't find what you're looking for? Try tweeting [@discordapp](https://twitter.com/discordapp) or emailing [support@discordapp.com](https://support.discordapp.com/hc/en-us/requests/new)!`)
        .setColor(0x4A90E2)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png');
      message.channel.send({ embed });
      await message.delete({ timeout: 5000 });
    }
  }
}

module.exports = Helpdesk;