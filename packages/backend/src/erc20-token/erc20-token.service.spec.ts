import { Test, TestingModule } from '@nestjs/testing';
import { Erc20TokenService } from './erc20-token.service.js';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Erc20Token } from './entities/erc20-token.entity.js';
import { Web3Provider } from '../web3/web3.provider.js';
import Web3 from 'web3';

describe('Erc20TokenService', () => {
  let service: Erc20TokenService;

  beforeEach(async () => {
    Repository.prototype.findOneBy = jest.fn().mockResolvedValue(null);
    Repository.prototype.findOne = jest.fn().mockResolvedValue(null);
    Repository.prototype.find = jest.fn().mockResolvedValue([]);
    Repository.prototype.save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        Erc20TokenService,
        ConfigService,
        {
          provide: getRepositoryToken(Erc20Token),
          useClass: Repository,
        },
        {
          provide: Web3,
          useFactory: Web3Provider,
          inject: [ConfigService],
        },
      ],
    }).compile();

    service = module.get<Erc20TokenService>(Erc20TokenService);
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });
});
