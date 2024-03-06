import { Test, TestingModule } from '@nestjs/testing';
import { LogsSubscription } from 'web3-eth-contract';
import { CurationEventService } from './curation-event.service';
import { Erc20TokenService } from '../erc20-token/erc20-token.service';
import { EthBlockService } from '../eth-block/eth-block.service';
import { Erc20Token } from '../erc20-token/entities/erc20-token.entity';
import { EthBlock } from '../eth-block/entities/eth-block.entity';
import { CurationEvent } from './entities/curation-event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Web3Provider } from '../web3/web3.provider';
import Web3 from 'web3';

describe('CurationEventService', () => {
  let service: CurationEventService;

  beforeEach(async () => {
    Repository.prototype.findOneBy = jest.fn().mockResolvedValue(null);
    Repository.prototype.findOne = jest.fn().mockResolvedValue(null);
    Repository.prototype.find = jest.fn().mockResolvedValue([]);
    Repository.prototype.save = jest.fn();
    LogsSubscription.prototype.on = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CurationEventService,
        EthBlockService,
        Erc20TokenService,
        {
          provide: getRepositoryToken(Erc20Token),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(CurationEvent),
          useClass: Repository,
        },
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

    service = module.get<CurationEventService>(CurationEventService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
