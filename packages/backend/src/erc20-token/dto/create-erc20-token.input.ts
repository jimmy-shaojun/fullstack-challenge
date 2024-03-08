import { InputType, Field } from '@nestjs/graphql';
import { NativeCurrencyContractAddress } from '../entities/erc20-token.entity.js';

@InputType()
export class CreateErc20TokenInput {
  @Field(() => String, {
    description:
      'If contractAddress is 0x0, it means native currency, otherwise, it is erc20 token',
  })
  contractAddress: string | NativeCurrencyContractAddress;
}
