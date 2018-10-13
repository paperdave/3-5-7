import { LocalGameInterface } from "./interface-local";
import { gameUIAdapter } from "./ui-adapter";
import { SocketGameInterface } from "./interface-socket";

// gameUIAdapter(new SocketGameInterface("http://localhost:3000",prompt("name", "Dave")));

const menu = document.querySelector(".menu") as HTMLElement;
const game = document.querySelector(".game") as HTMLElement;
game.classList.add("fade")
function fadeToGame() {
    menu.classList.add("fade");
    setTimeout(() => {
        menu.style.display = "none";
        game.style.display = "block";
        game.classList.remove("fade");
    }, 350);
}
function fadeToMenu() {
    game.classList.add("fade");
    setTimeout(() => {
        game.style.display = "none";
        menu.style.display = "block";
        menu.classList.remove("fade");
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