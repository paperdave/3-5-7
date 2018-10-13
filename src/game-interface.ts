export type PlayerID = "player1" | "player2";
export type Spot = {row: number, col: number};

/** Abstracts the API to a list of functions, which this is adapted
 *  to whatever you need, Socket server or a local game.
 */
export abstract class GameInterface {
    // Public Action Events
    public abstract makePlay(spot: Spot);
    public abstract makeEndTurn();
    public abstract canPressNextTurn(): boolean;
    public abstract getPlayerName(id: PlayerID): string;
    
    // Protectd Event Emitter Events
    protected emitGameReady() { this.emitEvent("gameReady"); }
    protected emitPlay(spot: Spot) { this.emitEvent("play", spot); }
    protected emitTurnEnd(player: PlayerID) { this.emitEvent("turnEnd", player); }
    protected emitWinner(player: PlayerID) { this.emitEvent("winner", player); }

    // Event Listening Events
    public onGameReady(callback: () => void) { this.addEventListener("gameReady", callback) };
    public onPlay(callback: (spot: Spot) => void) { this.addEventListener("play", callback) };
    public onTurnEnd(callback: (player: PlayerID) => void) { this.addEventListener("turnEnd", callback) };
    public onWinner(callback: (player: PlayerID) => void) { this.addEventListener("winner", callback) };

    // Private Event Emitter System
    private events: {[name: string]: Function[]} = {};
    private emitEvent(name: string, ...data: any[]) {
        if(!(name in this.events)) return;
        this.events[name].forEach( cb => cb.apply(this, data));
    }
    private addEventListener(name: string, callback: Function) {
        if(!(name in this.events)) this.events[name] = [];
        this.events[name].push(callback);
    }
}
