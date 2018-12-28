const fetch = require('node-fetch');

const url = (path) => `https://raw.githubusercontent.com/WumpusPrime/wiki/master/${path}.md`;

class ArticleManager {
  async load(client, path) {
    const key = `article:${path}`;
    const cached = await client.redis.get(key);
    if (!cached) {
      const res = await fetch(url(path));
      const content = await res.text();
      const name = content.match(/^<!-- TITLE: (.+) -->/);

      const obj = {
        path,
        name: name ? name[1] : null,
        content
      };

      await client.redis.setex(key, 86400, JSON.stringify(obj));

      return obj;
    } else {
      const obj = JSON.parse(cached);
      return obj;
    }
  }
}

module.exports = ArticleManager;