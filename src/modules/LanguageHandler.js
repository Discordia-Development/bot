class LanguageHandler {
  constructor() {}

  async getString(client, user, string) {
    const locale = await this.getLanguage(client, user);
    const langFile = require(`../lib/languages/${locale}.json`);
    return langFile[string];
  }

  async getLanguage(client, user) {
    const { locale } = await client.userSettings.get(user);
    return locale;
  }
}

module.exports = LanguageHandler;