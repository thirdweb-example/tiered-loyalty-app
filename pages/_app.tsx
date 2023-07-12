import type { AppProps } from "next/app";
import {
  ThirdwebProvider,
  coinbaseWallet,
  metamaskWallet,
  localWallet,
} from "@thirdweb-dev/react";
import "../styles/globals.css";
import { Navbar } from "../components/Navbar/Navbar";
import { activeChain } from "../const/constants";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedWallets={[localWallet(), metamaskWallet(), coinbaseWallet()]}
      thirdwebApiKey={process.env.THIRDWEB_API_KEY}
    >
      <Navbar />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
