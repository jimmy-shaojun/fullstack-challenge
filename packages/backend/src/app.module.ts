import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurationEventModule } from './curation-event/curation-event.module';
import { Erc20TokenModule } from './erc20-token/erc20-token.module';
import { EthBlockModule } from './eth-block/eth-block.module';
import { BigIntScalar } from './graphql/scalars/bigint.scalar';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfig } from './data-source';
import { IpfsController } from './ipfs.controller';

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
  providers: [AppService, BigIntScalar],
})
export class AppModule {}
