import { Level } from "level"; // Используем именованный импорт
import { Logger } from "../utils/Logger";

export class LevelDBClient {
  private db: Level;
  private logger: Logger = Logger.getInstance();

  constructor(dbPath: string = "./data/leveldb") {
    this.db = new Level(dbPath);
    this.logger.info(`LevelDBClient initialized with path: ${dbPath}`);
  }

  async get(key: string): Promise<string | null> {
    this.logger.debug(`Fetching key: ${key}`);
    try {
      const value = await this.db.get(key);
      this.logger.debug(`Key fetched: ${key}`);
      return value;
    } catch (error) {
      if ((error as any).type === "NotFoundError") {
        this.logger.warn(`Key not found: ${key}`);
        return null;
      }
      this.logger.error(`Error fetching key ${key}: ${error}`);
      throw error;
    }
  }

  async set(key: string, value: string): Promise<void> {
    this.logger.debug(`Setting key: ${key}`);
    try {
      await this.db.put(key, value);
      this.logger.debug(`Key set: ${key}`);
    } catch (error) {
      this.logger.error(`Error setting key ${key}: ${error}`);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    this.logger.debug(`Deleting key: ${key}`);
    try {
      await this.db.del(key);
      this.logger.debug(`Key deleted: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting key ${key}: ${error}`);
      throw error;
    }
  }

}