// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {

    const defaults = this.client.config.defaultSettings;
    const settings = message.guild ? this.client.settings.get(message.guild.id) : defaults;
    message.settings = settings;

    // It's good practice to ignore other bots. This also makes your bot ignore itself
    //  and not get into a spam loop (we call that "botception").
    if (message.author.bot) return;

    const mentionPrefix = new RegExp(`^<@!?${this.client.user.id}>`).exec(message.content);

    let prefix;
    if (mentionPrefix)
      prefix = mentionPrefix[0];
    else if (settings.prefixes.find(prefix => message.content.startsWith(prefix)))
      prefix = settings.prefixes.find(prefix => message.content.startsWith(prefix));

    if (!prefix) return;

    message.prefix = prefix;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const level = this.client.permlevel(message);

    // Check whether the command, or alias, exist in the collections defined
    // in app.js.
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    // using this const varName = thing OR otherthing; is a pretty efficient
    // and clean way to grab one of 2 values!
    if (!cmd) return;

    // To simplify message arguments, the author's level is now put on level (not member, so it is supported in DMs)
    // The "level" command module argument will be deprecated in the future.
    message.author.permLevel = level;

    if (level < this.client.levelCache[cmd.conf.permLevel]) return message.channel.send(`You do not have permission to use this command. Your permission level is ${level} (${this.client.config.permLevels.find(l => l.level === level).name}) This command requires level ${this.client.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
      message.flags.push(args.shift().slice(1));
    }

    // If the command exists, **AND** the user has permission, run it.
    this.client.log('Log', `${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`, 'CMD');
    
    cmd.run(message, args, level);
  }
};