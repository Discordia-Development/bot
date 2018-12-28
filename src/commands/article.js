const Command = require('../lib/structures/Command');
const fetch = require('node-fetch');
const fuse = require('fuse.js');

const popularArticles = require('../util/popularArticles');

class Article extends Command {
  constructor(client) {
    super(client, {
      name: 'article',
      description: 'Look up an article on the Wiki.',
      category: 'Main',
      usage: 'article <name>'
    });
  }

  async run(message, args, level) {
    const options = {
      id: 'name',
      keys: ['name'],
      shouldSort: true,
      threshold: 0.5,
      location: 10,
      distance: 100
    };

    const article = args.join(' ');

    if (!article) {
      const cached = await this.client.redis.get('popularArticles');
      let pageList;
      if (!cached) {
        const articles = await popularArticles();
        pageList = articles.map(async a => {
          const path = a.path.slice(1);
          const { name } = await this.client.articleManager.load(this.client, path);
          return `[${name}](https://discordia.me/${path})`;
        })
        this.client.redis.setex('popularArticles', 86400, pageList.join('\n'));
      } else {
        pageList = cached;
      }

      return message.buildEmbed()
        .setColor(0x4A90E2)
        .setTitle('Popular Articles')
        .setDescription(`${pageList.join('\n')}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!`)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
    }

    const { locale } = await this.client.userSettings.get(message.author.id);

    if (locale !== 'en-US') {
      const pages = await fetch(`https://api.github.com/repos/DiscordiaWiki/wiki/contents/${locale.split('-')[0]}`);
      const json = await pages.json();
      const list = json.map(p => ({ ...p, name: p.name.slice(0, -3) }));

      const Fuse = new fuse(list, options);

      let search = Fuse.search(article);
      search = search.length ? search[0] : 'No results.';

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
        .setDescription(`The article **${article}** can be found at ${url}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!\n\nNeed a different language? Try running \`?locale <random language>\``)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
    } else {
      const pages = await fetch('https://api.github.com/repos/DiscordiaWiki/wiki/contents');
      const json = await pages.json();
      const list = json.map(p => ({ ...p, name: p.name.slice(0, -3) }));

      const Fuse = new fuse(list, options);

      let search = Fuse.search(article);
      search = search.length ? search[0] : 'No results.';

      if (search === 'No results.') {
        return message.buildEmbed()
          .setColor(0x4A90E2)
          .setTitle('Invalid Article')
          .setDescription(`The article **${article}** doesn't exist. Please check your spelling or check \`?articles\` to make sure it's a valid article.\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)`)
          .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
          .send();
      }

      const url = `https://discordia.me/${search}`;
      const { name } = await this.client.articleManager.load(this.client, search);

      return message.buildEmbed()
        .setColor(0x4A90E2)
        .setTitle('Your Requested Article')
        .setDescription(`The article **${name}** can be found at ${url}\n\nCan't find what you're looking for? Ask a Wiki Editor [here](https://discord.gg/ZRJ9Ghh)!\n\nNeed a different language? Try running \`?locale <random language>\``)
        .setFooter('Discord WikiBot', 'https://cdn.discordapp.com/attachments/289177479971602432/289596862195957770/discordia_emote_1.png')
        .send();
    }
  }
}

module.exports = Article;
