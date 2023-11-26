import config from "../../service/config";

const controllers = {
  async fetchChain() {
    return await fetch(`${config.BACKEND}/chains`);
  },
  async fetchTokens(id) {
    return await fetch(`${config.BACKEND}/tokens?chainId=${id}`);
  },
  async fetchRoutes() {
    return await fetch(
      `${config.BACKEND}/quotes?fromChainId=137&toChainId=1&fromAssetAddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&toAssetAddress=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&inputAmount=50`
    );
  },
};

export default controllers;
