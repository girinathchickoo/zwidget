import WidgetContainer from "./Components/WidgetContainer";
import { createConfig, configureChains } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { mainnet, polygon, optimism } from "@wagmi/core/chains";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
const queryClient = new QueryClient();
function ZWidget() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, polygon, optimism],
    [publicProvider()]
  );
  const config = createConfig({
    autoConnect: true,
    publicClient,
    webSocketPublicClient,
  });
  return (
      <WidgetContainer />
  );
}

export default ZWidget;
