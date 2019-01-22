module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(member) {
    this.client.userSettings.set(member.id, this.client.config.defaultUserSettings);
  }
};