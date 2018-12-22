const Command = require('../lib/structures/Command');
const fetch = require('node-fetch');
const fuse = require('fuse.js');

const matchAll = require('../util/matchAll');

class Article extends Command {
  constructor(client) {
    super(client, {
      name: 'article'
    });
  }

  async run(message, args, level) {
    const options = {
      id: 'name',
      keys: ['name']
    };

    const article = args.join(' ');

    const data = await this.client.articleManager.data;
    const pageList = await matchAll(data, /\*\s\[([a-zA-Z0-9_-\s]+)\]\(\/([a-zA-Z0-9_-]+)\)(?:\s+<!--\s*(.+)\s*-->)?/gi);

    if (!article) {
      return message.buildEmbed()
        .setColor(0x4A90E2)
        .setTitle('Popular Articles')
        .setDescription(pageList.map(a => `[${a[1]}](https://discordia.me/${a[2]})`).slice(0, 5).join('\n') + '\n\nCan\'t find what you\'re looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!')
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
    }

    const { locale } = await this.client.userSettings.get(message.author.id);

    if (locale !== 'en-US') {
      const pages = await fetch(`https://api.github.com/repos/DiscordiaWiki/wiki/contents/${locale.split('-')[0]}`);
      const json = await pages.json();

      const Fuse = new fuse(json, options);
      const regex = /^(.+)\.md$/;

      let search = Fuse.search(article);
      search = search.length ? search[0].match(regex)[1] : 'No results.';

      if (search === 'No results.') {
        return message.buildEmbed()
          .setColor(0x4A90E2)
          .setTitle('Invalid Article')
          .setDescription(`The article **${article}** doesn't exist. Please check your spelling or check \`?articles\` to make sure it's a valid article.\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)`)
          .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
          .send();
      }

      const url = `https://discordia.me/${locale.split('-')[0]}/${search}`;

      return message.buildEmbed()
        .setColor(0x4A90E2)
        .setTitle('Your Requested Article')
        .setDescription(`The article **${article}** can be found at ${url}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!\n\nNeed a different language? Try running \`wikibot, language set <random language>\``)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
    } else {
      const pages = await fetch('https://api.github.com/repos/DiscordiaWiki/wiki/contents');
      const json = await pages.json();

      const Fuse = new fuse(json, options);
      const regex = /^(.+)\.md$/;

      let search = Fuse.search(article);
      search = search.length ? search[0].match(regex)[1] : 'No results.';

      console.log(search);

      if (search === 'No results.') {
        return message.buildEmbed()
          .setColor(0x4A90E2)
          .setTitle('Invalid Article')
          .setDescription(`The article **${article}** doesn't exist. Please check your spelling or check \`?articles\` to make sure it's a valid article.\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)`)
          .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
          .send();
      }

      const url = `https://discordia.me/${search}`;

      return message.buildEmbed()
        .setColor(0x4A90E2)
        .setTitle('Your Requested Article')
        .setDescription(`The article **${article}** can be found at ${url}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!\n\nNeed a different language? Try running \`wikibot, language set <random language>\``)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
    }
  }
}

module.exports = Article;