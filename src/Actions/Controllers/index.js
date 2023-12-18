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
  async convertVal(from, to, fromKey) {
    console.log(from, to, fromKey, "controller");
    return await fetch(
      `${config.COINGECKO}/api/v3/simple/price?ids=${
        (from || "") + "," + (to || "")
      }&vs_currencies=${"usd" + "," + (fromKey || "")}`
    );
  },
  async fetchNextTx(routeid, stepid) {
    return await fetch(
      `${config.BACKEND}/nextTx?routeId=${stepid}&stepId=${routeid}`
    );
  },
  async fetchStatus(routeid, stepid, txnhash) {
    return await fetch(
      `${config.BACKEND}/status?routeId=${routeid}&stepId=${stepid}&txnHash=${txnhash}`
    );
  },
};

export default controllers;
