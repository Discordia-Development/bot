const { MessageEmbed } = require('discord.js');

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(guild) {
    this.client.settings.set(guild.id, this.client.config.defaultSettings);
    this.client.log('Log', `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`, 'JOINED');

    const c = await this.client.channels.get(this.client.config.channels.info);
    const embed = new MessageEmbed()
      .setAuthor(this.client.user.username, this.client.user.displayAvatarURL())
      .setTitle('Guild Joined')
      .setDescription(`Guild Name: ${guild.name}\n\nGuild ID: ${guild.id}\n\nMember Count: ${guild.memberCount}`);
  }
};