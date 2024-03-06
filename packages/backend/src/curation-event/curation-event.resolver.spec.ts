import { Test, TestingModule } from '@nestjs/testing';
import { LogsSubscription } from 'web3-eth-contract';
import { CurationEventResolver } from './curation-event.resolver';
import { CurationEventService } from './curation-event.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EthBlockService } from '../eth-block/eth-block.service';
import { Erc20TokenService } from '../erc20-token/erc20-token.service';
import { Erc20Token } from '../erc20-token/entities/erc20-token.entity';
import { EthBlock } from '../eth-block/entities/eth-block.entity';
import { CurationEvent } from './entities/curation-event.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Web3Provider } from '../web3/web3.provider';
import Web3 from 'web3';

describe('CurationEventResolver', () => {
  let resolver: CurationEventResolver;

  beforeEach(async () => {
    Repository.prototype.findOneBy = jest.fn().mockResolvedValue(null);
    Repository.prototype.findOne = jest.fn().mockResolvedValue(null);
    Repository.prototype.find = jest.fn().mockResolvedValue([]);
    Repository.prototype.save = jest.fn();
    LogsSubscription.prototype.on = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        CurationEventResolver,
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

    resolver = module.get<CurationEventResolver>(CurationEventResolver);
  });

  it('should be defined', async () => {
    expect(resolver).toBeDefined();
  });

  it('should not get a curation event with id = 1', async () => {
    const event = await resolver.findOne(1n);
    expect(event).toBeNull();
    expect(Repository.prototype.findOne).not.toHaveBeenCalled();
    expect(Repository.prototype.findOneBy).toHaveBeenCalledWith({ id: 1n });
  });

  it('should return an empty event list', async () => {
    const events = await resolver.findAll();
    expect(events).toEqual([]);
    expect(Repository.prototype.find).toHaveBeenCalled();
    expect(Repository.prototype.findOne).not.toHaveBeenCalled();
    expect(Repository.prototype.findOneBy).not.toHaveBeenCalled();
  });
});
