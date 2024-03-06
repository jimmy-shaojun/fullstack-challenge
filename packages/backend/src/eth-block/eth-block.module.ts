import { Module } from '@nestjs/common';
import { EthBlockService } from './eth-block.service';
import { EthBlockResolver } from './eth-block.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EthBlock } from './entities/eth-block.entity';
import { Web3Provider } from 'src/web3/web3.provider';
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
