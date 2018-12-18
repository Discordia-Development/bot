const request = require('superagent');

const url = 'https://raw.githubusercontent.com/WumpusPrime/wiki/master/pages.md';

class ArticleManager {
  constructor() {
    this.load();
  }

  async load() {
    await request.get(url).end((err, res) => {
      if (err) {
        console.error('Could not fetch articles');
        // process.exit();
      }
      return this.data = res.text;
    });
  }
}

module.exports = ArticleManager;