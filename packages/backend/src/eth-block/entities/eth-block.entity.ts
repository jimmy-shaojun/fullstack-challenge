import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@ObjectType()
@Unique(['blockNumber'])
@Unique(['hash'])
export class EthBlock {
  @PrimaryGeneratedColumn('identity')
  @Field(() => BigInt, {
    description: 'Database Id of this token',
  })
  id: bigint;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  @Field(() => BigInt, { description: 'Block Number' })
  chainId: bigint;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  @Field(() => BigInt, { description: 'Block Number' })
  blockNumber: bigint;

  @Column()
  @Field(() => String, { description: 'Hash of the block' })
  hash: string;

  @Column()
  @Field(() => String, { description: 'Hash of the parent block' })
  parentHash: string;

  @Column({ type: 'int' })
  @Field(() => String, {
    description: 'The unix timestamp for when the block was collated',
  })
  timestamp: number;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  @Field(() => BigInt, { description: 'Nonce of the block' })
  nonce: bigint;

  @Column()
  @Field(() => String, { description: 'The “extra data” field of this block' })
  extraData: string;

  @Column()
  @Field(() => Int, { description: 'Integer the size of this block in bytes.' })
  size: number;
}
