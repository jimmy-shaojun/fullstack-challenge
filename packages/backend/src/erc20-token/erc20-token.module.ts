import { Module } from '@nestjs/common';
import { Erc20TokenService } from './erc20-token.service';
import { Erc20TokenResolver } from './erc20-token.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Erc20Token } from './entities/erc20-token.entity';
import Web3 from 'web3';
import { Web3Provider } from 'src/web3/web3.provider';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Erc20Token])],
  providers: [
    Erc20TokenResolver,
    Erc20TokenService,
    {
      provide: Web3,
      useFactory: Web3Provider,
      inject: [ConfigService],
    },
  ],
})
export class Erc20TokenModule {}
