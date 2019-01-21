### This software isn't meant for public use, this repository is used mainly for displaying changes to the end user. If you'd like to make pull requests, you're more than welcome to, however!

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
