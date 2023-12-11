import WidgetContainer from "./Components/WidgetContainer";
import { configureChains } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import {
  mainnet,
  polygon,
  optimism,
  goerli,
  sepolia,
  polygonMumbai,
} from "@wagmi/core/chains";
import "./index.css";
import { alchemyProvider } from "@wagmi/core/providers/alchemy";
import { WagmiConfig, createConfig } from "wagmi";
import { MetaMaskConnector } from "@wagmi/connectors/metaMask";
import { WalletConnectConnector } from "@wagmi/core/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { infuraProvider } from "@wagmi/core/providers/infura";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
const queryClient = new QueryClient();
function ZWidget() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygonMumbai, polygon, optimism, goerli, sepolia],
    [
      alchemyProvider({ apiKey: "UPTSl0S8hg5frz84jM4q1xc1pJzjHL86" }),
      infuraProvider({ apiKey: "509ce1bf287447d8b4c5c9f1c034b251" }),
      publicProvider(),
    ]
  );
  console.log(chains, "chains");
  const config = createConfig({
    autoConnect: true,
    publicClient,
    connectors: [
      new InjectedConnector({
        chains,
        options: { name: "Browser Wallet" },
        shimDisconnect: true,
      }),
      new MetaMaskConnector({ chains, shimDisconnect: true }),
      new CoinbaseWalletConnector({ chains, shimDisconnect: true }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: "a3cc5b84df95db911e2f9f9655114425",
        },
        shimDisconnect: true,
      }),
    ],
    webSocketPublicClient,
    publicClient,
  });
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <WagmiConfig config={config}>
        <WidgetContainer />
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default ZWidget;
