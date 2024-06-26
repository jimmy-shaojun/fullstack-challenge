import { CreateEthBlockInput } from './create-eth-block.input.js';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateEthBlockInput extends PartialType(CreateEthBlockInput) {
  @Field(() => Int)
  id: number;
}
