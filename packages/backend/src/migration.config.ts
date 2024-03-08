import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const databaseConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  synchronize: !!process.env.DATABASE_SYNCHRONIZE || false,
  migrations: [__dirname + '/migration/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true,
  logging: true,
  entities: [__dirname + '/**/entities/*.{ts,js}'],
  subscribers: [],
} as DataSourceOptions;

console.log(__dirname);

const datasource = new DataSource(databaseConfig);
datasource.initialize();
export default datasource;
