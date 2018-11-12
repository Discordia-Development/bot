require('dotenv').config();

const { Client, Collection } = require('discord.js');
const { promisify } = require('util');

const Sentry = require('@sentry/node');
const Haste = require('hastebin.js');
const Redis = require('ioredis');
const Enmap = require('enmap');

const readdir = promisify(require('fs').readdir);
const klaw = require('klaw');
const path = require('path');

const ArticleManager = require('./models/ArticleManager.js');
const LanguageHandler = require('./modules/LanguageHandler.js');

require('./modules/Prototypes.js');


class Wikibot extends Client {
  constructor(options) {
    super(options);
    Sentry.init({ dsn: 'https://2645fe786fa34611b69b1b411b5cbcaa@sentry.io/1305755' });
    
    this.config = require('./config.js');
    
    this.commands = new Collection();
    this.aliases = new Collection();
    this.redis = new Redis();
    
    this.articleManager = new ArticleManager();
    this.languageHandler = new LanguageHandler();

    this.userSettings = new Enmap({ name: 'userSettings', dataDir: './src/data/users/settings' });
    this.userPrefixes = new Enmap({ name: 'userPrefixes', dataDir: './src/data/users/prefixes'});
    
    this.settings = new Enmap({ name: 'settings', dataDir: './src/data/guilds' });

    this.util = {
      haste: new Haste()
    };
  }
  
  permlevel(message) {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  }

  log(type, msg, title) {
    if (!title) title = 'Log';
    console.log(`[${type}] [${title}] ${msg}`);
  }

  permCheck(message, perms) {
    if (message.channel.type !== 'text') return;
    return message.channel.permissionsFor(message.guild.me).missing(perms);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new(require(`${commandPath}${path.sep}${commandName}`))(client);
      props.conf.location = commandPath;
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return client.log('Log', `Unable to load command ${commandName}: ${e}`, 'ERROR');
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn't seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`${commandPath}/${commandName}.js`)];
    return false;
  }
}

const client = new Wikibot({
  fetchAllMembers: true
});

require('./util/functions.js')(client);

const init = async () =>{

  const commandList = [];
  klaw('./src/commands').on('data', (item) => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== '.js') return;
    const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
    commandList.push(cmdFile.name);
    if (response) console.log(response);
  }).on('end', () => {
    client.log('Log', `Loaded a total of ${commandList.length} commands.`);
  }).on('error', (error) => client.log('ERROR', error));

  const eventList = [];
  klaw('./src/events').on('data', (item) => {
    const eventFile = path.parse(item.path);
    if (!eventFile.ext || eventFile.ext !== '.js') return;
    const eventName = eventFile.name.split('.')[0];
    try {
      const event = new(require(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`))(client);
      eventList.push(event);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`${eventFile.dir}${path.sep}${eventFile.name}${eventFile.ext}`)];
    } catch (error) {
      client.log('ERROR', `Error loading event ${eventFile.name}: ${error}`);
    }
  }).on('end', () => {
    client.log('Log', `Loaded a total of ${eventList.length} events.`);
  }).on('error', (error) => client.log('ERROR', error));

  // const structureList = [];
  // klaw('./src/lib/extenders').on('data', (item) => {
  //   const structureFile = path.parse(item.path);
  //   if (!structureFile.ext || structureFile.ext !== '.js') return;
  //   try {
  //     const structure = require(`${structureFile.dir}${path.sep}${structureFile.name}${structureFile.ext}`);
  //     structureList.push(structure);
  //   } catch (error) {
  //     client.log('ERROR', `Error loading structure ${structureFile.name}: ${error}`);
  //   }
  // }).on('end', () => {
  //   client.log('Log', `Loaded a total of ${structureList.length} structures.`);
  // }).on('error', (error) => client.log('ERROR', error));

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }

  client.login(client.config.token);
};

init();