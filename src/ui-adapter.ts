import { GameInterface } from "./game-interface";

export function gameUIAdapter(game: GameInterface) {
    const nextTurn = document.querySelector(".finish-turn");
    const gameElement = document.querySelector(".game");
    const status = document.querySelector(".status");
    const winText = document.querySelector(".win-text");

    game.onGameReady(() => {
        console.log("ADAPTER: Game is starting")
        game.onPlay((spot) => {
            const brick = document.querySelector(`.brick[data-row="${spot.row}"][data-col="${spot.col}"]`);
    
            if (brick) {
                brick.classList.add("taken");
                brick.classList.add("currentturn");
            }
            if (game.canPressNextTurn()) {
                nextTurn.classList.add("available");
            }
        });
    
        game.onWinner((winner) => {
            // console.log("win!", game.getPlayerName(winner));
            winText.innerHTML = `${game.getPlayerName(winner)} won the game.`
            nextTurn.classList.remove("available");
            setTimeout(() => {
                gameElement.classList.add("finished");
            }, 750);
        });
    
        status.innerHTML = `${game.getPlayerName(game.getCurrentPlayer())}'s Turn.`;
    
        game.onTurnEnd((newturn) => {
            status.classList.add("fadeinout");
            setTimeout(() => {
                status.innerHTML = `${game.getPlayerName(newturn)}'s Turn.`;
            }, 250);
            setTimeout(() => {
                status.classList.remove("fadeinout");
            }, 500);
    
            nextTurn.classList.remove("available");
            document.querySelectorAll(".currentturn").forEach(elem => elem.classList.remove("currentturn"));
        });
    
        document.querySelectorAll(".brick").forEach(elem => {
            elem.addEventListener("click", () => {
                const row = parseInt(elem.getAttribute("data-row"));
                const col = parseInt(elem.getAttribute("data-col"));
                game.makePlay({ col, row });
            });
        });
    
        nextTurn.addEventListener("click", () => {
            if (game.canPressNextTurn()) {
                game.makeEndTurn();
            }
        });
    });

    // Debug use
    window["$current_game"] = game;
}