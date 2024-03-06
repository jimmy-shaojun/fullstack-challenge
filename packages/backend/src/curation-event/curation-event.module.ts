import { Module } from '@nestjs/common';
import { CurationEventService } from './curation-event.service';
import { CurationEventResolver } from './curation-event.resolver';
import { EthBlockService } from '../eth-block/eth-block.service';
import { Erc20TokenService } from '../erc20-token/erc20-token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Erc20Token } from '../erc20-token/entities/erc20-token.entity';
import { EthBlock } from '../eth-block/entities/eth-block.entity';
import { CurationEvent } from './entities/curation-event.entity';
import { Web3Provider } from 'src/web3/web3.provider';
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
