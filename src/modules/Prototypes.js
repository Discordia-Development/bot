const { Message, Channel, MessageEmbed, TextChannel, DMChannel, User } = require('discord.js');
const ms = require('ms');


String.prototype.toProperCase = function() {
  return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

String.prototype.toPlural = function() {
  return this.replace(/((?:\D|^)1 .+?)s/g, '$1');
};
  
Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};


Message.prototype.buildEmbed = function() {
  return this.channel.buildEmbed();
};

Channel.prototype.buildEmbed = function() {
  return Object.defineProperty(new MessageEmbed(), 'sendToChannel', { value: this });
};

MessageEmbed.prototype.send = function(content) {
  if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof User || this.sendToChannel instanceof DMChannel)) return Promise.reject('Embed not created in a channel');
  return this.sendToChannel.send(content || '', { embed: this });
};

