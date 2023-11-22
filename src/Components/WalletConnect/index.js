import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { connect, getAccount, getNetwork } from "@wagmi/core";
import { mainnet, optimism, polygon } from '@wagmi/core/chains'
export default function WalletConnect() {

  const connector = new WalletConnectConnector({
    chains: [mainnet, optimism, polygon],
    options: {
      projectId: "a3cc5b84df95db911e2f9f9655114425",
    },
    metadata: {
      name: "wagmi",
      description: "my wagmi app",
      url: "https://wagmi.sh",
      icons: ["https://wagmi.sh/icon.png"],
    },
  });
  async function handleConnect() {
   let res= await connector.connect()
   let account=await connector.getAccount()
   let chain=await connector.getWalletClient()
   console.log(account,chain)
  }
  return (
    <>
    <button
      onClick={() => {
        handleConnect();
      }}
    >
      WalletConnect
    </button>
    <button
    onClick={async () => {
     await connector.disconnect()
    }}
  >
    WalletConnect
  </button>
  </>
  );
}
