import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

export type NativeCurrencyContractAddress = '0x0';

@Entity()
@ObjectType()
@Unique(['chainId', 'contractAddress'])
export class Erc20Token {
  @PrimaryGeneratedColumn('identity')
  @Field(() => BigInt, {
    description: 'Database Id of this token',
  })
  id: bigint;

  @Column()
  @Field(() => Int, {
    description: 'chainId identifies which chain this token belongs to',
  })
  chainId: number;

  @Column()
  @Field(() => String, {
    description:
      'If contractAddress is 0x0, it means native currency, otherwise, it is erc20 token',
  })
  contractAddress: string | NativeCurrencyContractAddress;

  @Column()
  @Field(() => String, { description: 'Name of this erc20 token' })
  name: string;

  @Column()
  @Field(() => String, {
    description: 'Symbol of this erc20 token, e.g., USDT',
  })
  symbol: string;

  @Column({ type: 'numeric', precision: 78, scale: 0 })
  @Field(() => BigInt, { description: 'total supply of this erc20 token' })
  totalSupply: bigint;

  @Column()
  @Field(() => Int, { description: 'Example field (placeholder)' })
  decimals: number;
}
