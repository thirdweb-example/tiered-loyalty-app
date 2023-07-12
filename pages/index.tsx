import type { NextPage } from "next";
import styles from "../styles/Main.module.css";
import NFTComponent from "../components/NFT/NFT";
import {
  ConnectWallet,
  Web3Button,
  useAddress,
  useContract,
  useOwnedNFTs,
  useContractWrite,
} from "@thirdweb-dev/react";
import { nftDropAddress } from "../const/constants";
import Container from "../components/Container/Container";
import toast from "react-hot-toast";
import toastStyle from "../util/toastConfig";
import Skeleton from "../components/Skeleton/Skeleton";

/**
 * The home page of the application.
 */
const Home: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(nftDropAddress, "nft-drop");
  const {
    data: nfts,
    isLoading,
    refetch,
  } = useOwnedNFTs(nftDropContract, address);
  const {
    mutateAsync: claimNft,
    isLoading: loadingClaim,
    error,
  } = useContractWrite(nftDropContract, "claim");

  const claimMembership = async (address: string) => {
    try {
      await claimNft({ args: [address] });
      toast("NFT Claimed!", {
        icon: "✅",
        style: toastStyle,
        position: "bottom-center",
      });
    } catch (e: any) {
      console.log(e);
      toast(`NFT Claim Failed! Reason: ${e.message}`, {
        icon: "❌",
        style: toastStyle,
        position: "bottom-center",
      });
    }
  };
  return (
    <Container maxWidth="lg">
      {address ? (
        <div className={styles.container}>
          <h1>Login to your Membership</h1>

          {nfts ? (
            nfts.length > 0 ? (
              <>
                <p>Click here to enter your membership</p>
                <div className={styles.nftContainer}>
                  <NFTComponent nft={nfts[0]} />
                </div>
              </>
            ) : (
              <>
                <p>Click here to create a membership</p>
                <div className={styles.btnContainer}>
                  <Web3Button
                    contractAddress={nftDropAddress}
                    action={async () => await claimMembership(address)}
                  >
                    Create Membership
                  </Web3Button>
                </div>
              </>
            )
          ) : (
            <div className={styles.nftContainer}>
              <Skeleton width={"100%"} height={"300px"} />
            </div>
          )}
        </div>
      ) : (
        <div className={styles.container}>
          <h2>Connect a personal account to log into your membership</h2>
          <ConnectWallet />
        </div>
      )}
    </Container>
  );
};

export default Home;
