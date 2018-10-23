// Interface for online play using socket.io
import * as socket from 'socket.io-client';
import { GameInterface, PlayerID, Spot } from './game-interface';

function spotToIndex(spot: Spot) {
    let ind = spot.col + 1;
    if(spot.row == 1) ind+=3;
    if(spot.row == 2) ind+=8;
    return ind;
}
function indexToSpot(ind: number): Spot {
    switch(ind) {
        case 1: return { row:0, col:0 };
        case 2: return { row:0, col:1 };
        case 3: return { row:0, col:2 };
        case 4: return { row:1, col:0 };
        case 5: return { row:1, col:1 };
        case 6: return { row:1, col:2 };
        case 7: return { row:1, col:3 };
        case 8: return { row:1, col:4 };
        case 9: return { row:1, col:0 };
        case 10: return { row:2, col:1 };
        case 11: return { row:2, col:2 };
        case 12: return { row:2, col:3 };
        case 13: return { row:2, col:4 };
        case 14: return { row:2, col:5 };
        case 15: return { row:2, col:6 };
    }
}

export class SocketGameInterface extends GameInterface {
    public io: SocketIOClient.Socket;
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
        this.io.emit("newPlayer", name);
        this.io.on("playerUpdate", (list) => {
            if(list.length !== 2) {
                return;
            }

            this.lobby = list;
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
        this.io.on("markUpdate", (row, mark) => {
            const spot = indexToSpot(mark);
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
        this.io.on("turnUpdate", (turn) => {
            if ((this.yourName === this.lobby[0] && turn === 1)
            &&  (this.yourName === this.lobby[1] && turn === 2)) {
                this.turn = "player1";
                this.emitTurnEnd(this.turn);
            }
        });
        this.onWinner(() => {
            this.io.disconnect();
        });
    }

    public makePlay(spot: Spot) {
        if (this.turn === "player2") return false;
        if (this.row === -1) this.row = spot.row;
        if (this.row !== spot.row) return false;
        if (this.gameGrid[spot.row][spot.col]) return false;
        
        this.gameGrid[spot.row][spot.col] = true;
        this.emitPlay(spot);

        this.io.emit("updatedMark", spot.row + 1, spotToIndex(spot));

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

        this.io.emit("switchTurns");
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
