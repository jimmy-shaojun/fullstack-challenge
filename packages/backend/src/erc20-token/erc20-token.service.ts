import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateErc20TokenInput } from './dto/create-erc20-token.input.js';
import { Erc20Token } from './entities/erc20-token.entity.js';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import chains from '../web3/chains.js';
import contractAbi from '../web3/erc20.abi.js';
import { Repository } from 'typeorm';

@Injectable()
export class Erc20TokenService {
  private nativeCurrency: Erc20Token;
  private chainId: number;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Erc20Token)
    private erc20TokenRepository: Repository<Erc20Token>,
    private web3: Web3,
  ) {
    this.web3.eth.getChainId().then((chainId) => {
      this.createNativeCurrency(chainId);
    });
  }

  async createNativeCurrency(chainId: bigint) {
    const erc20TokenRepository = this.erc20TokenRepository;
    for (const chain of chains) {
      if (`${chain.chainId}` === `${chainId}`) {
        this.nativeCurrency = {
          chainId: chain.chainId,
          name: chain.nativeCurrency.name,
          symbol: chain.nativeCurrency.symbol,
          totalSupply: 0n,
          contractAddress: '0x0',
          decimals: chain.nativeCurrency.decimals,
        } as Erc20Token;
        this.chainId = chain.chainId;
        const existing = await erc20TokenRepository.findOneBy({
          chainId: chain.chainId,
          contractAddress: '0x0',
        });
        if (existing) {
          this.nativeCurrency.id = existing.id;
        }
        return erc20TokenRepository.save(this.nativeCurrency);
      }
    }
    return null;
  }

  async create(createErc20TokenInput: CreateErc20TokenInput) {
    const existingToken = await this.findOneByContractAddress(
      createErc20TokenInput.contractAddress,
    );
    if (existingToken) {
      return existingToken;
    }

    if (createErc20TokenInput.contractAddress === '0x0') {
      return this.createNativeCurrency(BigInt(this.chainId));
    }

    const erc20TokenRepository = this.erc20TokenRepository;
    const { contractAddress } = createErc20TokenInput;

    const contract = new this.web3.eth.Contract(contractAbi, contractAddress);
    const name = await contract.methods.name().call();
    const symbol = await contract.methods.symbol().call();
    const totalSupply = await contract.methods.totalSupply().call();
    const decimals = await contract.methods.decimals().call();

    const erc20Token = {
      chainId: this.chainId,
      name: name as unknown as string,
      symbol: symbol as unknown as string,
      totalSupply: totalSupply as unknown as bigint,
      decimals: Number(decimals as unknown),
      contractAddress,
    } as Erc20Token;

    return erc20TokenRepository.save(erc20Token);
  }

  findAll() {
    const erc20TokenRepository = this.erc20TokenRepository;
    return erc20TokenRepository.find({ where: { chainId: this.chainId } });
  }

  findOne(id: bigint) {
    const erc20TokenRepository = this.erc20TokenRepository;
    return erc20TokenRepository.findOneBy({ id });
  }

  findOneByContractAddress(contractAddress: string) {
    const erc20TokenRepository = this.erc20TokenRepository;
    return erc20TokenRepository.findOneBy({
      contractAddress,
      chainId: this.chainId,
    });
  }
}
