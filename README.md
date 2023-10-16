# MarineHQ - OPTCG Bounty Bot

This is a Discord Bot for OPTCG communities to use if they want to run their own 'Bounty Board' for the players, as a sort of mini-game alongside tournaments and casual games.

## Usage

https://github.com/LoveGlitchCoffee/marinehq/assets/10636469/a6781c31-d034-41f8-93e2-40141620fe0f

## Installation
To run this bot as your own, you will need to set up `config.json` in the `src` to use:
1. Your own Discord App's ID and Token
2. A PSQL database endpoint (I use neon.tech), and a table called `pirates` matching the columns `(pirate_name, username, bounty, image_url, poster_url)`
3. An image host that runs on chevereto API (I use freeimage.host)
4. Somewhere to host the bot

## Credits
This Discord Bot was made by Hung Hoang for Spellbound Games OPTCG community.

[One Piece Poster Generator](https://github.com/YuskaWu/one-piece-wanted-poster) by YuskaWu
