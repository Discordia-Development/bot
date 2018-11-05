const { Structures, User, TextChannel, DMChannel } = require('discord.js');

module.exports = Structures.extend('MessageEmbed', MessageEmbed => class WikiEmbed extends MessageEmbed {
  send(content) {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject('Embed not created in a channel');
    return this.sendToChannel.send(content || '', {
      embed: this
    });
  }
});