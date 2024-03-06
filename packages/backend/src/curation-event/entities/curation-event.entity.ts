import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Erc20Token } from '../../erc20-token/entities/erc20-token.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@ObjectType()
@Unique(['txnHash', 'logIndex', 'blockNumber'])
export class CurationEvent {
  @PrimaryGeneratedColumn('identity')
  @Field(() => BigInt, {
    description: 'Database Id of this token',
  })
  id: bigint;

  @Column()
  @Field(() => String, {
    description:
      'Transaction Hash of the transaction that this event is associated with',
  })
  txnHash: string;

  @Column()
  @Field(() => Int, { description: 'Log Index of this event' })
  logIndex: number;

  @Column()
  @Field(() => String, { description: 'The sender of this curation event' })
  from: string;

  @Column()
  @Field(() => String, { description: 'The receiver of this curation event' })
  to: string;

  @Column()
  @Field(() => String, { description: 'Uri, specifically, a CID of IPFS' })
  uri: string;

  @ManyToOne(() => Erc20Token, { eager: true })
  @Field(() => Erc20Token, { description: 'the token' })
  token: Erc20Token;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  @Field(() => BigInt, { description: 'the amount token' })
  amount: bigint;

  @Column({ type: 'numeric', precision: 32, scale: 0 })
  @Field(() => BigInt, {
    description: 'Block Number associated with this event',
  })
  blockNumber: bigint;

  @Column()
  @Field(() => Date, { description: 'date and time that this event occured' })
  date: Date;
}
