import { Module } from '@nestjs/common';
import { CurationEventService } from './curation-event.service.js';
import { CurationEventResolver } from './curation-event.resolver.js';
import { EthBlockService } from '../eth-block/eth-block.service.js';
import { Erc20TokenService } from '../erc20-token/erc20-token.service.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Erc20Token } from '../erc20-token/entities/erc20-token.entity.js';
import { EthBlock } from '../eth-block/entities/eth-block.entity.js';
import { CurationEvent } from './entities/curation-event.entity.js';
import { Web3Provider } from '../web3/web3.provider.js';
import Web3 from 'web3';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Erc20Token, EthBlock, CurationEvent]),
  ],
  providers: [
    CurationEventResolver,
    CurationEventService,
    EthBlockService,
    Erc20TokenService,
    {
      provide: Web3,
      useFactory: Web3Provider,
      inject: [ConfigService],
    },
  ],
})
export class CurationEventModule {}
