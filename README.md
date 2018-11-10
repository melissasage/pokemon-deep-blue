# Pokémon Deep Blue Version

My contribution to the Stackathon of Grace Hopper cohort 1809 at Fullstack Academy.

Porygon is an AI that plays Pokemon Generation I- Red, Blue, Yellow- through the Pokemon Showdown server.

## Installation

`git clone` this repo, and `npm install` in the cloned directory. Register an account for the bot to use at [Pokemon Showdown](https://play.pokemonshowdown.com/).

Next, `touch secrets.js` and in it define two `process.env` variables: `PASSWORD`, the password to the bot account, and `CHALLENGER`, which is the username you'd like the bot to issue challenges to.

Run `npm start`, accept the challenge on Showdown, and tada! You're playing against the bot.

## Features

Right now, the bot defaults to a random algorithm, where it chooses a move 80% of the time, and switches the other 20%.

[An example of random algorithm play.](http://replay.pokemonshowdown.com/gen1randombattle-833459054). The bot is the guest account.

Known bugs:

- Login to bot account is sometimes unsuccessful for unknown reasons.
