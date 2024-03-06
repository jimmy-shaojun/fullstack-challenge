import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCurationEventInput {
  @Field(() => String, {
    description:
      'Transaction Hash of the transaction that this event is associated with',
  })
  txnHash: string;

  @Field(() => BigInt, { description: 'Log Index of this event' })
  logIndex: bigint;

  @Field(() => String, { description: 'The sender of this curation event' })
  from: string;

  @Field(() => String, { description: 'The receiver of this curation event' })
  to: string;

  @Field(() => String, { description: 'Uri, specifically, a CID of IPFS' })
  uri: string;

  @Field(() => String, { description: 'contractAddress of the token' })
  tokenContractAddress: string;

  @Field(() => BigInt, { description: 'the amount token' })
  amount: bigint;

  @Field(() => BigInt, {
    description: 'Block Number associated with this event',
  })
  blockNumber: bigint;
}
