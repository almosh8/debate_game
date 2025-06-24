import { Game } from "../../domain/Game";
import { Player } from "../../domain/Player";

export interface IGameRepository {
    findById(gameId: string): Promise<Game | null>;
    save(game: Game): Promise<void>;
}
