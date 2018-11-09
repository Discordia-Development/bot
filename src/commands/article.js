const Command = require('../lib/structures/Command.js');
const fetch = require('node-fetch');

const matchAll = require('../util/matchAll');

class Article extends Command {
  constructor(client) {
    super(client, {
      name: 'article',
      description: 'Search for an article.',
      category: 'System',
      usage: '[article:args]',
      permLevel: 'User'
    });
  }

  async run(message, args) {
    const article = args.join(' ');
    const data = await this.client.articleManager.data;
    const pageList = await matchAll(data, /\*\s\[([a-zA-Z0-9_-\s]+)\]\(\/([a-zA-Z0-9_-]+)\)(?:\s+<!--\s*(.+)\s*-->)?/gi);

    if (!article) { 
      message.buildEmbed()
        .setColor(0x7289DA)
        .setTitle('Popular Articles')
        .setDescription(pageList.map(a => `[${a[1]}](${a[2]})`).slice(0, 5).join('\n') + '\n\nCan\'t find what you\'re looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!')
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
      return await message.delete({ timeout: 5000 });
    }
    const { locale } = this.client.userSettings.get(message.author.id);

    if (locale !== 'en-US') {
      const lang = locale.split('-')[0];
      const finalArticle = article.toLowerCase();
      const url = `https://github.com/WumpusPrime/The-Unofficial-Discord-Wiki/blob/master/${lang}/${finalArticle}.md`;
      const returnArticle = `https://discordia.me/${lang}/${finalArticle}`;

      await fetch(url).then(res => {
        if (res.status !== 200) {
          message.buildEmbed()
            .setColor(0x99AAB5)
            .setTitle('Invalid Article')
            .setDescription(`The article **${article}** doesn't exist. Please check your spelling or check \`?articles\` to make sure it's a valid article.\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!`)
            .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
            .send();
          message.delete({ timeout: 5000 });
        } else {
          message.buildEmbed()
            .setColor(0x7289DA)
            .setTitle('Your Requested Article')
            .setDescription(`The article **${article}** can be found at ${returnArticle}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!\n\nNeed a different language? Try running \`${this.client.settings.get(message.guild.id).prefix}language set fr-FR\`.`)
            .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
            .send();
          message.delete({ timeout: 5000 });
        }
      });
    } else {
      const finalArticle = article.toLowerCase();
      const url = `https://github.com/WumpusPrime/The-Unofficial-Discord-Wiki/blob/master/${finalArticle}.md`;
      const returnArticle = `https://discordia.me/${finalArticle}`;

      await fetch(url).then(res => {
        if (res.status !== 200) {
          message.buildEmbed()
            .setColor(0x99AAB5)
            .setTitle('Invalid Article')
            .setDescription(`The article **${article}** doesn't exist. Please check your spelling or check \`?articles\` to make sure it's a valid article.\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!`)
            .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
            .send();
          message.delete({ timeout: 5000 });
        } else {
          message.buildEmbed()
            .setColor(0x7289DA)
            .setTitle('Your Requested Article')
            .setDescription(`The article **${article}** can be found at ${returnArticle}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!\n\nNeed a different language? Try running \`${this.client.settings.get(message.guild.id).prefix}language set fr-FR\`.`)
            .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
            .send();
          message.delete({ timeout: 5000 });
        }
      });
    }
  }
}

module.exports = Article;
