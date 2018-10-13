import * as socket from 'socket.io-client';
import { GameInterface, PlayerID, Spot } from './game-interface';

function spotToIndex(spot: Spot) {
    
}
function indexToSpot(ind: number) {
    
}

export class SocketGameInterface extends GameInterface {
    private io: SocketIOClient.Socket;
    private lobby: string[] = null;
    private yourName = "";
    private opponentName = "<loading>";
    private turn: PlayerID = "player1";
    private row = -1;
    private gameGrid = [
        [false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false, false, false]
    ];

    constructor(uri: string, name: string) {
        super();
        this.io = socket(uri);
        this.yourName = name;
        this.io.emit("join", name);
        this.io.on("join", (list) => {
            this.lobby = list;
        });
        this.io.on("startGame", (list) => {
            if(this.yourName === list[0]) {
                // we go first
                this.opponentName = list[1];
                this.turn = "player1";
            } else {
                // we go second
                this.opponentName = list[0];
                this.turn = "player2";
            }
            this.emitGameReady();
        });
        this.io.on("updatedMark", (spot) => {
            this.gameGrid[spot.row][spot.col] = true;
            this.emitPlay(spot);
            const win = !this.gameGrid.reduce((prev, current) => current.reduce((prev, current) => !current || prev, false) || prev, false);
            if (win) {
                // they
                this.makeEndTurn();
                this.emitWinner("player1");
                this.row = -1;
            }
        });
        this.io.on("switchTurn", () => {
            this.turn = "player1";
            this.emitTurnEnd(this.turn);
        });
    }

    public makePlay(spot: Spot) {
        if (this.turn === "player2") return false;
        if (this.row === -1) this.row = spot.row;
        if (this.row !== spot.row) return false;
        if (this.gameGrid[spot.row][spot.col]) return false;
        
        this.gameGrid[spot.row][spot.col] = true;
        this.emitPlay(spot);

        this.io.emit("updatedMark", spot);

        const win = !this.gameGrid.reduce((prev, current) => current.reduce((prev, current) => !current || prev, false) || prev, false);
        if (win) {
            // we lost
            this.makeEndTurn();
            this.emitWinner("player2");
            this.row = -1;
        }
    }

    public makeEndTurn() {
        if (this.turn === "player2") return false;
        if (this.row === -1) return false;
        this.row = -1;
        this.turn = "player2";
        this.emitTurnEnd(this.turn);

        this.io.emit("switchTurn");
    }

    public getPlayerName(id: PlayerID) {
        return id === "player1" ? this.yourName : this.opponentName;
    }
    public canPressNextTurn() {
        if (this.turn === "player2") return false;
        return this.row !== -1;
    }
    public getCurrentPlayer() {
        return this.turn;
    }
}