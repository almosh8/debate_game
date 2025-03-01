// src/infrastructure/RedisClient.ts
import Redis from "ioredis";

export class RedisClient {
  private client: Redis;

  constructor() {
    this.client = new Redis();
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}