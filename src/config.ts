import { createConfig, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { createClient } from "viem";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

// Chains
export const chains = [mainnet, sepolia];

// Connectors (RainbowKit requires projectId)
const { connectors } = getDefaultWallets({
  appName: "Real Estate",
  projectId: "d9e3a42eb7d78093ee15a3c9dce2357c", // required
});

// Wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(), // simple HTTP transport
    });
  },
});
