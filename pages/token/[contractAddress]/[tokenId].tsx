import {
  MediaRenderer,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useOwnedNFTs,
  useWallet,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import Container from "../../../components/Container/Container";
import { GetStaticProps, GetStaticPaths } from "next";
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { activeChain, nftDropAddress } from "../../../const/constants";
import styles from "../../../styles/Token.module.css";
import { Toaster } from "react-hot-toast";
import { Signer } from "ethers";
import newSmartWallet from "../../../components/SmartWallet/SmartWallet";
import SmartWalletConnected from "../../../components/SmartWallet/smartConnected";

type Props = {
  nft: NFT;
  contractMetadata: any;
};

export default function TokenPage({ nft, contractMetadata }: Props) {
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(
    null
  );
  const [signer, setSigner] = useState<Signer>();

  // get the currently connected wallet
  const address = useAddress();
  const wallet = useWallet();

  // create a smart wallet for the NFT
  useEffect(() => {
    const createSmartWallet = async (nft: NFT) => {
      if (nft && smartWalletAddress == null && address && wallet) {
        const smartWallet = newSmartWallet(nft);
        console.log("personal wallet", address);
        await smartWallet.connect({
          personalWallet: wallet,
        });
        setSigner(await smartWallet.getSigner());
        console.log("signer", signer);
        setSmartWalletAddress(await smartWallet.getAddress());
        console.log("smart wallet address", await smartWallet.getAddress());
        return smartWallet;
      } else {
        console.log("smart wallet not created");
      }
    };
    createSmartWallet(nft);
  }, [nft, smartWalletAddress, address, wallet]);

  const { contract } = useContract(nftDropAddress);
  const { data: clientSideNFT } = useOwnedNFTs(contract, address);
  const renderNFT = clientSideNFT ? clientSideNFT[0] : nft;

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Container maxWidth="lg">
        <div className={styles.container}>
          <div className={styles.metadataContainer}>
            <ThirdwebNftMedia
              metadata={renderNFT.metadata}
              className={styles.image}
            />
          </div>

          <div className={styles.listingContainer}>
            {contractMetadata && (
              <div className={styles.contractMetadataContainer}>
                <MediaRenderer
                  src={contractMetadata.image}
                  className={styles.collectionImage}
                />
                <p className={styles.collectionName}>{contractMetadata.name}</p>
              </div>
            )}
            <h1 className={styles.title}>{nft.metadata.name}</h1>
            <p className={styles.collectionName}>Token ID #{nft.metadata.id}</p>
            {smartWalletAddress ? (
              <SmartWalletConnected signer={signer} />
            ) : (
              <div className={styles.btnContainer}>
                <p>Loading...</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const tokenId = context.params?.tokenId as string;

  const sdk = new ThirdwebSDK(activeChain, {
    thirdwebApiKey: process.env.THIRDWEB_API_KEY,
  });

  const contract = await sdk.getContract(nftDropAddress);

  const nft = await contract.erc721.get(tokenId);

  const base64String = nft.metadata.uri.split(",")[1]; // extracts the base64 part of the data URI

  // decodes the base64 string to a regular string
  const jsonString = Buffer.from(base64String, "base64").toString("utf8");

  // parse the JSON string into an object
  const jsonObject = JSON.parse(jsonString);

  nft.metadata.uri = jsonObject;
  nft.metadata.image = jsonObject.image.replace(
    "ipfs://",
    "https://ipfs.thirdwebcdn.com/ipfs/"
  );
  nft.metadata.name = jsonObject.name;

  console.log(nft.metadata.image, "uri");

  let contractMetadata;

  try {
    contractMetadata = await contract.metadata.get();
    if (contractMetadata.description === undefined) {
      contractMetadata.description = "";
    }
  } catch (e) {}

  return {
    props: {
      nft,
      contractMetadata: contractMetadata || null,
    },
    revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const sdk = new ThirdwebSDK(activeChain, {
    thirdwebApiKey: process.env.THIRDWEB_API_KEY,
  });

  const contract = await sdk.getContract(nftDropAddress);

  const nfts = await contract.erc721.getAll();

  const paths = nfts.map((nft) => {
    const base64String = nft.metadata.uri.split(",")[1]; // extracts the base64 part of the data URI

    // decodes the base64 string to a regular string
    const jsonString = Buffer.from(base64String, "base64").toString("utf8");

    // parse the JSON string into an object
    const jsonObject = JSON.parse(jsonString);

    nft.metadata.uri = jsonObject;
    nft.metadata.image = jsonObject.image.replace(
      "ipfs://",
      "https://ipfs.thirdwebcdn.com/ipfs/"
    );
    nft.metadata.name = jsonObject.name;
    console.log("nft metadata uri", nft.metadata.name);
    return {
      params: {
        contractAddress: nftDropAddress,
        tokenId: nft.metadata.id,
      },
    };
  });

  return {
    paths,
    fallback: "blocking", // can also be true or 'blocking'
  };
};
