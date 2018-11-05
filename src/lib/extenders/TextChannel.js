const { Structures, MessageEmbed } = require('discord.js');

module.exports = Structures.extend('TextChannel', TextChannel => class WikiChannel extends TextChannel {
  buildEmbed() {
    return Object.defineProperty(new MessageEmbed(), 'sendToChannel', {
      value: this
    });
  }
});