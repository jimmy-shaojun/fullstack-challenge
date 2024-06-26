import { ConfigService } from '@nestjs/config';
import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const DataSourceConfig = (configService: ConfigService) => {
  return {
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_DB'),
    synchronize: !!configService.get<string>('DATABASE_SYNCHRONIZE') || false,
    migrations: [__dirname + '/migration/*.js'],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    logging: configService.get<boolean>('DATABASE_LOGGING'),
    entities: [__dirname + '/**/entities/*.js'],
    subscribers: [],
  } as DataSourceOptions;
};
