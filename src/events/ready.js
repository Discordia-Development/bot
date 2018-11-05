module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    await this.client.wait(2000);

    this.client.appInfo = await this.client.fetchApplication();

    this.client.guilds.filter(g => !this.client.settings.has(g.id)).forEach(g => this.client.settings.set(g.id, this.client.config.defaultSettings));

    this.client.users.filter(u => !this.client.userSettings.has(u.id)).forEach(u => this.client.userSettings.set(u.id, this.client.config.defaultUserSettings));
    this.client.users.filter(u => !this.client.userPrefixes.has(u.id)).forEach(u => this.client.userPrefixes.set(u.id, this.client.config.defaultUserPrefixes));


    this.client.log('Log', `${this.client.user.tag}, ready to serve ${this.client.users.size} users in ${this.client.guilds.size} servers.`, 'Ready');
  }
};
