module.exports = async (globalConfig, projectConfig) => {
  process.env.ETH_HTTPS_RPC_URL = 'http://127.0.0.1:8545/';
  process.env.ETH_WEBSOCKET_RPC_URL = 'HARDHAT';
  process.env.CURATION_CONTRACT_ADDRESS =
    '0x5edebbdae7B5C79a69AaCF7873796bb1Ec664DB8';
};
