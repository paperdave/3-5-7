import { LocalGameInterface } from "./interface-local";
import { gameUIAdapter } from "./ui-adapter";
import { SocketGameInterface } from "./interface-socket";

gameUIAdapter(new SocketGameInterface("http://localhost:3000",prompt("name", "Dave")));