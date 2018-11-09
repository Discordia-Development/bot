const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;   
  }

  async run(ratelimit) {
    const c = await this.client.channels.get(this.client.config.channels.info);
    const embed = new MessageEmbed()
      .setTitle('Ratelimit Hit')
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      // .addField('Ratelimit Path: ', ratelimit.path, true)
      // .addField('Ratelimit Method', ratelimit.method, true)
      // .addField('Ratelimit Timeout', `${ratelimit.timeout} ms`, true);
      .setDescription(`Ratelimit Path: ${ratelimit.path}\nRatelimit Method: ${ratelimit.method}\nRatelimit Timeout: ${ratelimit.timeout} ms`);
    await c.send({ embed });
  }
};