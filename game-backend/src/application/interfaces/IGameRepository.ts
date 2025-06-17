import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

export interface IGameRepository {
    createGame(players: Player[]): Promise<Game>;
    findById(gameId: string): Promise<Game | null>;
    save(game: Game): Promise<void>;
}
