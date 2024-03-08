import { Test, TestingModule } from '@nestjs/testing';
import { Erc20TokenResolver } from './erc20-token.resolver.js';
import { Erc20TokenService } from './erc20-token.service.js';
import { ConfigService } from '@nestjs/config';
import { Erc20Token } from './entities/erc20-token.entity.js';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Web3Provider } from '../web3/web3.provider.js';
import Web3 from 'web3';

describe('Erc20TokenResolver', () => {
  let resolver: Erc20TokenResolver;

  beforeEach(async () => {
    Repository.prototype.findOneBy = jest.fn().mockResolvedValue(null);
    Repository.prototype.findOne = jest.fn().mockResolvedValue(null);
    Repository.prototype.find = jest.fn().mockResolvedValue([]);
    Repository.prototype.save = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        Erc20TokenResolver,
        Erc20TokenService,
        ConfigService,
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

    resolver = module.get<Erc20TokenResolver>(Erc20TokenResolver);
  });

  it('should be defined', async () => {
    expect(resolver).toBeDefined();
  });

  it('should return an empty list of tokens', async () => {
    expect(await resolver.findAll()).toEqual([]);
    expect(Repository.prototype.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.anything() }),
    );
    expect(Repository.prototype.findOne).not.toHaveBeenCalled();
    expect(Repository.prototype.findOneBy).not.toHaveBeenCalled();
  });

  it('should return null for id 1', async () => {
    expect(await resolver.findOne(1n)).toBeNull();
    expect(Repository.prototype.find).not.toHaveBeenCalled();
    expect(Repository.prototype.findOne).not.toHaveBeenCalled();
    expect(Repository.prototype.findOneBy).toHaveBeenCalledWith({ id: 1n });
  });
});
