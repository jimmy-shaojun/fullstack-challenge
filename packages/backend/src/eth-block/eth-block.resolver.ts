import { Resolver, Query, Args } from '@nestjs/graphql';
import { EthBlockService } from './eth-block.service.js';
import { EthBlock } from './entities/eth-block.entity.js';

@Resolver(() => EthBlock)
export class EthBlockResolver {
  constructor(private readonly ethBlockService: EthBlockService) {}

  @Query(() => [EthBlock], { name: 'allEthBlocks' })
  findAll() {
    return this.ethBlockService.findAll();
  }

  @Query(() => EthBlock, { name: 'ethBlock' })
  findOne(@Args('id', { type: () => BigInt }) id: bigint) {
    return this.ethBlockService.findOne(id);
  }

  @Query(() => EthBlock, { name: 'ethBlockByBlockNumber' })
  findOneByBlockNumber(
    @Args('blockNumber', { type: () => BigInt }) blockNumber: bigint,
  ) {
    return this.ethBlockService.getBlock(blockNumber);
  }
}
