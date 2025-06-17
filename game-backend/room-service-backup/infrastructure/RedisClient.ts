// src/infrastructure/RedisClient.ts
import Redis from "ioredis";
import { DatabaseClient } from "./DatabaseClient";

export class RedisClient implements DatabaseClient {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: "127.0.0.1",
      port: 6379,
    });

    this.client.on("error", (error) => {
      console.error("Redis connection error:", error);
    });

    this.client.on("connect", () => {
      console.log("Connected to Redis successfully!");
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}