const Command = require('../lib/structures/Command');
const fetch = require('node-fetch');
const fuse = require('fuse.js');

class EArticle extends Command {
  constructor(client) {
    super(client, {
      name: 'earticle'
    });
  }

  async run(message, args, level) {
    const options = {
      id: 'name',
      keys: ['name']
    };
    const pages = await fetch('https://api.github.com/repos/DiscordiaWiki/wiki/contents');
    const json = await pages.json();
    const Fuse = new fuse(json, options);
    const regex = /^(.+)\.md$/;

    let search = Fuse.search(args.join(' '));
    search = search.length ? search[0].match(regex)[1] : 'No results.';

    console.log(search);
  }
}

module.exports = EArticle;