import Metamask, { MetaMaskSDK } from "@metamask/sdk";
import detectEthereumProvider from "@metamask/detect-provider";
const options = {
  injectProvider: false,
  communicationLayerPreference: "webrtc",
  preferDesktop: true,
  dappMetadata: { name: "My Dapp", url: "https://mydapp.com" },
};
const MMSDK = new MetaMaskSDK(options);
const metamask = new Metamask();
export default async function connectMetamask() {
  const provider = await detectEthereumProvider();
  console.log(provider,'prov')
  async function detect() {
    console.log('detect')
    if (provider) {
      try {
       
        let res = await window.ethereum.request({
          method: "eth_requestAccounts",
          params: [],
        });
        const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });
        console.log({ chainId, account: res }, "data");
        window.ethereum.on("chainChanged", handleChainChanged);
        return { chainId, account: res };
      } catch (err) {
        console.log(err);
      }
    }
  }


return detect()
  function handleChainChanged(chainId) {
    window.location.reload();
  }
}

export async function disconnectMetamask() {
    const metamask = new Metamask();
  try {
     metamask.disconnect();
    console.log('disconnected')
  } catch (err) {
    console.log(err, "err");
  }
}
