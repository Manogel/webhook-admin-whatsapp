import { RedisOptions } from 'ioredis';
import appConfig from './app';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',

  config: {
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_POST,
      password: process.env.REDIS_PASS || undefined,
      keyPrefix: `${appConfig.name}:`,
    },
  },
} as ICacheConfig;
