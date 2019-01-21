### This software isn't meant to be run independently, this repository is used mainly for displaying changes to the end user. If you'd like to make pull requests, you're more than welcome to, however!

For end users looking to run the bot on their public servers, please invite the public test build [here.](https://www.discordwiki.bot/invite)

### [Documentation (Not complete)](https://discordwiki.bot)

# Setup

- Have Node 8.4.0 or higher installed.

## Install Redis
```
sudo apt update
sudo apt install redis-server
```


## Clone the bot
```
git clone -b js https://github.com/DiscordiaWiki/bot
npm i
```


## Make settings directories
```
cd js
mkdir src/data/users/settings
mkdir src/data/users/prefixes

mkdir src/data/guilds
```


## Make config file
### Replace the value in `token`
### Add your User ID in `admins`
```
sudo nano src/config.js
```


## Run the bot
```
node .
```

You're all set!
