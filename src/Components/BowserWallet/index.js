import { useState } from "react";
import { connect, getAccount, getNetwork, fetchBalance } from "@wagmi/core";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import useStore from "../../zustand/store";
import { mainnet, polygon, optimism } from '@wagmi/core/chains'
export default function BrowserWallet({ handleShowWallet, handleSetWallet }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const walletData = useStore((state) => state.walletData);
  const setWalletData = useStore((state) => state.setWalletData);

  async function handleMetamaskConnect() {
    try {
      const result = await connect({
        connector: new InjectedConnector({
          chains: [mainnet, optimism, polygon],
        }),
      });
      let account = getAccount();
      const balance = await fetchBalance({
        address: account.address,
      });
      console.log(balance);
      const { chain, chains } = getNetwork();
      console.log(account);
      setWalletData({ ...account, ...chain, ...balance });
      setIsLoading(false);
      handleSetWallet("metamask");
      handleShowWallet(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  }
  return (
    <button
    disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        handleMetamaskConnect();
      }}
    >
      {isLoading ? "Loading." : "Browser Wallet"}
    </button>
  );
}
