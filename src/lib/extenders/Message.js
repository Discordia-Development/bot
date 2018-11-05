const { Structures } = require('discord.js');

module.exports = Structures.extend('Message', Message => class WikiMessage extends Message {
  buildEmbed() {
    return this.channel.buildEmbed();
  }
});