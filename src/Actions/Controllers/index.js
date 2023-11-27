import config from "../../service/config";

const controllers = {
  async fetchChain() {
    return await fetch(`${config.BACKEND}/chains`);
  },
  async fetchTokens(id) {
    return await fetch(`${config.BACKEND}/tokens?chainId=${id}`);
  },
  async fetchRoutes(recipient,id) {
    return await fetch(
      `${config.BACKEND}/quotes?fromChainId=137&toChainId=137&fromAssetAddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&toAssetAddress=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&inputAmount=50&outputAmount=50&recipient=${recipient}`
    );
  },
  async fetchTxnBody(params) {
    console.log(`${config.BACKEND}${params}`)
    return await fetch(`${config.BACKEND + params}`)
  },
};

export default controllers;
