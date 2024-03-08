export default () => ({
  web3: {
    ethHttpsJsonRpcUrl: process.env.ETH_HTTPS_RPC_URL,
    ethWebSocketRpcUrl: process.env.ETH_WEBSOCKET_RPC_URL,
    curationContractAddress: process.env.CURATION_CONTRACT_ADDRESS,
  },
});
