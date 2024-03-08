import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { EthBlock } from './entities/eth-block.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EthBlockService {
  private chainId: bigint;

  constructor(
    @InjectRepository(EthBlock)
    private ethBlockRepository: Repository<EthBlock>,
    private web3: Web3,
  ) {
    this.web3.eth.getChainId().then((chainId) => {
      this.chainId = chainId;
    });
  }

  async findOne(id: bigint) {
    const blockRepository = this.ethBlockRepository;
    return blockRepository.findOneBy({ id });
  }

  async findAll() {
    const blockRepository = this.ethBlockRepository;
    return blockRepository.find();
  }

  async getBlock(blockNumber: bigint) {
    const blockRepository = this.ethBlockRepository;
    const existing = await blockRepository.findOneBy({
      chainId: this.chainId,
      blockNumber,
    });
    if (existing) return existing;

    const block = await this.web3.eth.getBlock(blockNumber);
    const ethBlock = {
      chainId: this.chainId,
      blockNumber,
      hash: block.hash,
      parentHash: block.parentHash,
      nonce: block.nonce,
      extraData: block.extraData,
      timestamp: block.timestamp,
      size: Number(block.size),
    } as unknown as EthBlock;
    return blockRepository.save(ethBlock);
  }
}
