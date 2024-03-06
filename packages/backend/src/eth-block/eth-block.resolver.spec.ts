import { Test, TestingModule } from '@nestjs/testing';
import { EthBlockResolver } from './eth-block.resolver';
import { EthBlockService } from './eth-block.service';
import { EthBlock } from './entities/eth-block.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Web3Provider } from '../web3/web3.provider';
import Web3 from 'web3';

describe('EthBlockResolver', () => {
  let resolver: EthBlockResolver;

  beforeEach(async () => {
    Repository.prototype.findOneBy = jest.fn().mockResolvedValue(null);
    Repository.prototype.findOne = jest.fn().mockResolvedValue(null);
    Repository.prototype.find = jest.fn().mockResolvedValue([]);
    Repository.prototype.save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        EthBlockResolver,
        EthBlockService,
        {
          provide: getRepositoryToken(EthBlock),
          useClass: Repository,
        },
        {
          provide: Web3,
          useFactory: Web3Provider,
          inject: [ConfigService],
        },
      ],
    }).compile();

    resolver = module.get<EthBlockResolver>(EthBlockResolver);
  });

  it('should be defined', async () => {
    expect(resolver).toBeDefined();
  });
});
