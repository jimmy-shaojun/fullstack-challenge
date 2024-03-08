import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Erc20TokenService } from './erc20-token.service.js';
import { Erc20Token } from './entities/erc20-token.entity.js';
import { CreateErc20TokenInput } from './dto/create-erc20-token.input.js';

@Resolver(() => Erc20Token)
export class Erc20TokenResolver {
  constructor(private readonly erc20TokenService: Erc20TokenService) {}

  @Mutation(() => Erc20Token)
  createErc20Token(
    @Args('createErc20TokenInput') createErc20TokenInput: CreateErc20TokenInput,
  ) {
    return this.erc20TokenService.create(createErc20TokenInput);
  }

  @Query(() => [Erc20Token], { name: 'allErc20Tokens' })
  findAll() {
    return this.erc20TokenService.findAll();
  }

  @Query(() => Erc20Token, { name: 'erc20Token' })
  findOne(@Args('id', { type: () => BigInt }) id: bigint) {
    return this.erc20TokenService.findOne(id);
  }

  @Query(() => Erc20Token, { name: 'erc20TokenByContractAddress' })
  findOneByContractAddress(
    @Args('contractAddress', { type: () => String }) contractAddress: string,
  ) {
    return this.erc20TokenService.findOneByContractAddress(contractAddress);
  }
}
