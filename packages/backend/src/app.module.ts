import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurationEventModule } from './curation-event/curation-event.module.js';
import { Erc20TokenModule } from './erc20-token/erc20-token.module.js';
import { EthBlockModule } from './eth-block/eth-block.module.js';
import { BigIntScalar } from './graphql/scalars/bigint.scalar.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './data-source.js';
import { IpfsController } from './ipfs.controller.js';
import { IpfsService } from './ipfs.service.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return DataSourceConfig(configService);
      },
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: '../common/schemas/schema.graphqls',
      driver: ApolloDriver,
    }),
    ConfigModule.forRoot(),
    CurationEventModule,
    Erc20TokenModule,
    EthBlockModule,
  ],
  controllers: [AppController, IpfsController],
  providers: [AppService, IpfsService, BigIntScalar],
})
export class AppModule {}
