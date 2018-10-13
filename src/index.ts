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

// Local Game
document.getElementById("START_LOCAL_GAME").addEventListener("click", () => {
    fadeToGame();
    const g = gameUIAdapter(new LocalGameInterface());
    g.onWinner(() => {
        setTimeout(() => {
            fadeToMenu();
        }, 5000);
    })
});

// Online Game
const mainoptions = document.querySelector(".main-options") as HTMLElement;
const onlineoptions = document.querySelector(".online-options") as HTMLElement;
document.getElementById("SHOW_ONLINE_OPTIONS").addEventListener("click", () => {
    mainoptions.classList.add("fade");
    setTimeout(() => {
        mainoptions.style.display = "none";
        onlineoptions.style.display = "block";
    }, 350);
    setTimeout(() => {
        onlineoptions.classList.remove("fade");
    }, 370);
});
document.getElementById("CANCEL_ONLINE_OPTIONS").addEventListener("click", () => {
    onlineoptions.classList.add("fade");
    setTimeout(() => {
        onlineoptions.style.display = "none";
        mainoptions.style.display = "block";
    }, 350);
    setTimeout(() => {
        mainoptions.classList.remove("fade");
    }, 370);
});
document.getElementById("START_ONLINE_GAME").addEventListener("click", () => {
    let server = (document.getElementById("SERVER_TO_JOIN") as HTMLInputElement).value;
    const name = (document.getElementById("DISPLAY_NAME") as HTMLInputElement).value;

    if(server.trim() === "") return;
    if(name.trim() === "") return;

    if(server.indexOf(":") === -1) server += ":3000";

    console.log(server);
    const g = new SocketGameInterface("http://" + server, name);
    gameUIAdapter(g);
    
    let hasConnected = false;
    g.io.on("connect", () => {
        hasConnected = true;
    });
    const interval = setInterval(() => {
        document.querySelector(".connect-status").innerHTML = g.io.connected 
            ? `Waiting for other player...`
            : hasConnected
                ? `Disconnected, trying to reconnect...`
                : `Connecting...`
    }, 100);
    
    g.onGameReady(() => {
        fadeToGame();
    });

    g.onWinner(() => {
        setTimeout(() => {
            fadeToMenu();
        }, 5000);
        clearInterval(interval);
        document.querySelector(".connect-status").innerHTML = "";
    });
});