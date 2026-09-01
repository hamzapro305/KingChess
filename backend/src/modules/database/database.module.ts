import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService): MongooseModuleOptions => {
        const logger = new Logger('MongoDB');

        const uri = configService.getOrThrow<string>('MONGODB_URI');

        logger.log('Connecting to MongoDB...');

        return {
          uri,

          retryAttempts: 3,
          retryDelay: 3000,

          connectionFactory: (connection: Connection): Connection => {
            connection.on('connected', () => {
              logger.log('MongoDB connected successfully');
            });

            connection.on('disconnected', () => {
              logger.warn('MongoDB disconnected');
            });

            connection.on('reconnected', () => {
              logger.log('MongoDB reconnected successfully');
            });

            connection.on('error', (error: Error) => {
              logger.error('MongoDB connection error', error.stack);
            });

            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
