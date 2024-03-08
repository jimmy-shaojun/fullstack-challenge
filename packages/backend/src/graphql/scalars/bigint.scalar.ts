import { CustomScalar, Scalar } from '@nestjs/graphql';
import { ValueNode, Kind } from 'graphql';

@Scalar('BigInt', () => BigInt)
export class BigIntScalar implements CustomScalar<string, bigint> {
  description = 'bigint to support uint256';

  parseValue(value: string): bigint {
    return BigInt(value);
  }

  serialize(value: bigint) {
    return `${value}`;
  }

  parseLiteral(ast: ValueNode): bigint {
    if (ast.kind == Kind.INT || ast.kind == Kind.STRING) {
      return BigInt(ast.value);
    }
    throw new Error("can only parse INT or STRING literal to bigint");
  }
}
