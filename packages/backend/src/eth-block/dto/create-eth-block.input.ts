import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateEthBlockInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
