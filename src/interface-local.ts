import { GameInterface, Spot, PlayerID } from "./game-interface";

export class LocalGameInterface extends GameInterface {
    private gameGrid = [
        [false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false, false, false]
    ];
    private turn: PlayerID = "player1";
    private row = -1;
    private winner: PlayerID = null;

    constructor() {
        super();
    }

    public makePlay(spot: Spot) {
        if(this.row === -1) this.row = spot.row;
        if(this.row !== spot.row) return false;
        if(this.gameGrid[spot.row][spot.col]) return false;
        this.gameGrid[spot.row][spot.col] = true;
        this.emitPlay(spot);

        const win = !this.gameGrid.reduce((prev, current) => current.reduce((prev, current) => !current || prev, false) || prev, false);
        if(win) {
            // who ever played this loses
            this.makeEndTurn();
            this.emitWinner(this.turn);
            this.row = -1;
        }
    }

    public makeEndTurn() {
        if(this.row === -1) return false;
        this.row = -1;
        this.turn = this.turn === "player1" ? "player2" : "player1";
        this.emitTurnEnd(this.turn);
    }
    
    public canPressNextTurn() {
        return this.row !== -1;
    }
    
    public getPlayerName(id: PlayerID) {
        return id === "player1" ? "Player 1" : "Player 2";
    }
}