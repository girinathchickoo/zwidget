import config from "../../service/config";

const controllers = {
  async fetchChain() {
    return await fetch(`${config.BACKEND}/chains`);
  },
  async fetchTokens(id) {
    return await fetch(`${config.BACKEND}/tokens?chainId=${id}`);
  },
  async fetchRoutes(recipient, fromChain, toChain, fromCoin, toCoin, value) {
    return await fetch(
      `${config.BACKEND}/quotes?fromChainId=${fromChain.chainId}&toChainId=${toChain.chainId}&fromAssetAddress=${fromCoin.address}&toAssetAddress=${toCoin.address}&inputAmount=${value}&outputAmount=50&userWalletAddress=${recipient}`
    );
  },
  async fetchTxnBody(params) {
    return await fetch(`${config.BACKEND + params}`);
  },
  async fetchBalance(address) {
    return await fetch(`${config.BACKEND}/balances?walletAddress=${address}`);
  },
  async convertVal(from, to,fromKey) {
    return await fetch(
      `${config.COINGECKO}/api/v3/simple/price?ids=${
        from + "," + to
      }&vs_currencies=${"usd"+","+fromKey}`
    );
  },
};

export default controllers;
