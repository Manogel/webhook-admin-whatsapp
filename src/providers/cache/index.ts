import Redis, { Redis as RedisClient } from "ioredis";
import cacheConfig from "../../config/cache";

class RedisCacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    this.client.set(key, JSON.stringify(value), "EX", 60 * 60 * 24);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidade(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidadePrefix(prefix: string): Promise<void> {
    const keys: string[] = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach((key) => pipeline.del(key));

    await pipeline.exec();
  }

  public async getKeys(path: string): Promise<void> {
    await this.client.keys(path);
  }
}

export default new RedisCacheProvider();
