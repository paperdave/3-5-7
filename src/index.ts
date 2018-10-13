// Handles the menu, and switching in and out of the game states.
// Creates LocalGameInterface and SocketGameInterface insteances
import { LocalGameInterface } from "./interface-local";
import { gameUIAdapter } from "./ui-adapter";
import { SocketGameInterface } from "./interface-socket";

const menu = document.querySelector(".menu") as HTMLElement;
const game = document.querySelector(".game") as HTMLElement;
game.classList.add("fade")
function fadeToGame() {
    menu.classList.add("fade");
    setTimeout(() => {
        game.style.display = "block";
        menu.style.display = "none";
        setTimeout(() => {
            game.classList.remove("fade");
        }, 20);
    }, 350);
}
function fadeToMenu() {
    game.classList.add("fade");
    setTimeout(() => {
        menu.style.display = "block";
        game.style.display = "none";
        setTimeout(() => {
            menu.classList.remove("fade");
        }, 20);
    }, 350);
}

document.getElementById("START_LOCAL_GAME").addEventListener("click", () => {
    fadeToGame();
    const g = gameUIAdapter(new LocalGameInterface());
    g.onWinner(() => {
        setTimeout(() => {
            fadeToMenu();
        }, 5000);
    })
});