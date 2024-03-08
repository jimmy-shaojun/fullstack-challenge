import { Test, TestingModule } from '@nestjs/testing';
import { EthBlockService } from './eth-block.service.js';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EthBlock } from './entities/eth-block.entity.js';
import { Repository } from 'typeorm';
import { Web3Provider } from '../web3/web3.provider.js';
import Web3 from 'web3';

describe('EthBlockService', () => {
  let service: EthBlockService;

  beforeEach(async () => {
    Repository.prototype.findOneBy = jest.fn().mockResolvedValue(null);
    Repository.prototype.findOne = jest.fn().mockResolvedValue(null);
    Repository.prototype.find = jest.fn().mockResolvedValue([]);
    Repository.prototype.save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EthBlockService,
        ConfigService,
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

    service = module.get<EthBlockService>(EthBlockService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
