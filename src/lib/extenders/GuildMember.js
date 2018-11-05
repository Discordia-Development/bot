const { Structures } = require('discord.js');


module.exports = Structures.extend('GuildMember', GuildMember => class WikiMember extends GuildMember {
  get locale() {
    const settings = this.client.db.membersettings.findOne({ where: { id: member.id } });
    return settings.locale;
  }
});