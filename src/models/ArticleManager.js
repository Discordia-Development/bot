const fetch = require('node-fetch');

const url = 'https://raw.githubusercontent.com/WumpusPrime/wiki/master/meta/featured.md';

class ArticleManager {
  constructor() {
    this.load();
  }

  async load() {
    await fetch(url).then(res => {
      return this.data = res.text();
    });
  }
}

module.exports = ArticleManager;