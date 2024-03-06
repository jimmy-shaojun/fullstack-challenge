import { CreateCurationEventInput } from './create-curation-event.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCurationEventInput extends PartialType(
  CreateCurationEventInput,
) {
  @Field(() => Int)
  id: number;
}
