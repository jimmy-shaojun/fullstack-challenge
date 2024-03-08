import { Field, ObjectType } from "@nestjs/graphql";
import { Erc20Token } from "../../erc20-token/entities/erc20-token.entity.js";

@ObjectType()
export class BeneficiaryStats {
  @Field(() => String, { description: 'The writer/to who gets rewards from "from"/sponsor for its content' })
  beneficiary: string;

  @Field(() => Date, { description: 'the date from which, inclusive, we compute statistics of sponsor givings' })
  fromDate: Date;

  @Field(() => Date, { description: 'the date to which, non-inclusive, we compute statistics of sponsor givings' })
  toDate: Date;

  @Field(() => Erc20Token, { description: 'the token' })
  token: Erc20Token;

  @Field(() => BigInt, { description: 'the total amount of receiving' })
  amount: bigint;

  @Field(() => String, { description: 'the total amount after apply token decimals' })
  amountInDecimals: string;

  @Field(() => String, { description: 'the total amount after applying decimals and token symbol' })
  formattedAmount: string;
}