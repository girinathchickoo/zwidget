import { useState } from "react";
import { connect, getAccount, getNetwork, fetchBalance } from "@wagmi/core";

import useStore from "../../zustand/store";
import { mainnet, polygon, optimism } from "@wagmi/core/chains";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import prepareTx from "../WidgetForm/prepareTxn";
export default function MetamaskWallet({ handleShowWallet, handleSetWallet }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const walletData = useStore((state) => state.walletData);
  const setWalletData = useStore((state) => state.setWalletData);
  const connector = new MetaMaskConnector({
    chains: [mainnet, optimism, polygon],
  });
  async function handleMetamaskConnect() {
    try {
      let result = await connector.connect();
      console.log(result, connector.getAccount(), "result");
      let account = { address: result?.account };
      let chain;
      connector.chains?.forEach((item, i) => {
        if (result.chain.id == item.id) {
          chain = item;
        }
      });
      const balance = await fetchBalance({
        address: account.address,
        chainId: chain.id,
      });
      setWalletData({
        ...account,
        ...chain,
        ...balance,
        connector,
      });
      setIsLoading(false);
      handleSetWallet("metamask");
      handleShowWallet(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }
  return (
    <>
      <button
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          handleMetamaskConnect();
        }}
      >
        {isLoading ? "Loading." : "Metamask"}
      </button>
      <button
        onClick={() => {
          prepareTx(connector, walletData);
        }}
      >
        PrepareTransaction
      </button>
    </>
  );
}
