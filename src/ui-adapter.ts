// Handles the game board, takes in a game interface handler.
import { GameInterface } from "./game-interface";

export function gameUIAdapter(game: GameInterface) {
    const nextTurn = document.querySelector(".finish-turn");
    const gameElement = document.querySelector(".game");
    const status = document.querySelector(".status");
    const winText = document.querySelector(".win-text");

    game.onGameReady(() => {
        function brickClickListener() {
            const row = parseInt(this.getAttribute("data-row"));
            const col = parseInt(this.getAttribute("data-col"));
            game.makePlay({ col, row });
        }
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
            winText.innerHTML = `${game.getPlayerName(winner)} won the game.`;
            nextTurn.classList.remove("available");
            setTimeout(() => {
                gameElement.classList.add("finished");
            }, 750);
            setTimeout(() => {
                document.querySelectorAll(".brick").forEach(elem => {
                    elem.removeEventListener("click", brickClickListener);
                    elem.classList.remove("taken"); 
                });
                gameElement.classList.remove("finished");
            }, 5350);
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
            elem.addEventListener("click", brickClickListener);
        });
    
        nextTurn.addEventListener("click", () => {
            if (game.canPressNextTurn()) {
                game.makeEndTurn();
            }
        });
    });

    // Debug use
    window["$current_game"] = game;

    return game;
}