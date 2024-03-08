import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';

export const Web3Provider = (configService: ConfigService) => {
  const wssRpcUrl = configService.get<string>('ETH_WEBSOCKET_RPC_URL');
  if (wssRpcUrl === 'HARDHAT') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hre = require('hardhat');
    return new Web3(hre.network.provider);
  }
  return new Web3(wssRpcUrl);
};
