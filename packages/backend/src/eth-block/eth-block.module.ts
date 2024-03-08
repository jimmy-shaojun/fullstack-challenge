import { Module } from '@nestjs/common';
import { EthBlockService } from './eth-block.service.js';
import { EthBlockResolver } from './eth-block.resolver.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EthBlock } from './entities/eth-block.entity.js';
import { Web3Provider } from '../web3/web3.provider.js';
import Web3 from 'web3';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([EthBlock])],
  providers: [
    EthBlockResolver,
    EthBlockService,
    {
      provide: Web3,
      useFactory: Web3Provider,
      inject: [ConfigService],
    },
  ],
})
export class EthBlockModule {}
