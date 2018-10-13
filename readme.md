# 3-5-7 (Dave's Version)
Turn based game about turning marks red, the person to turn the last mark red
loses. Supports Online Multiplayer or Local Multiplayer play.

*The online mode is compatible with [Hunter's version of 3-5-7](https://hparcells.me/games/3-5-7/)
([Github](https://github.com/hparcells/3-5-7))*

## Rules
1. You may turn as many marks as you want red, but they have to be in the same row.
2. You must turn at least one mark red each turn.
3. You may not turn marks back green.
4. Your turn ends when you are done making marks red.
5. You win the game when your opponent turns the last mark red.

## Running a server
Go to the [server repository]() and download the server program written in nodejs.

## Building
The game is written in TypeScript, compiled with webpack. To build:

1. Make sure nodejs and npm is installed. Check with `npm --version`
2. Install dependencies: `npm i -d`
3. Build code: `npm run build`

A `357.js` file will be outputted and you can host the following files in the
same folder to run the game client:
- index.html
- style.css
- 357.js
