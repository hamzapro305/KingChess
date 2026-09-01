import {
  Global,
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

type RedisClient = RedisClientType;

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisClient> => {
        const logger = new Logger('Redis');
        const client = createClient({
          url: configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
        });

        client.on('connect', () => logger.log('Redis connecting...'));
        client.on('ready', () => logger.log('Redis connected successfully'));
        client.on('reconnecting', () => logger.warn('Redis reconnecting'));
        client.on('error', (error: Error) =>
          logger.error('Redis connection error', error.stack),
        );

        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: RedisClient,
  ) {}

  async onModuleDestroy(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
    }
  }
}
