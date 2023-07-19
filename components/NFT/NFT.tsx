import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { NFT } from "@thirdweb-dev/sdk";
import React from "react";
import styles from "./NFT.module.css";
import Link from "next/link";
import { nftDropAddress } from "../../const/constants";

type Props = {
  nft: NFT;
  emptyText?: string;
};

// Each NFT component shows the NFT image, name, and token ID.
export default function NFTComponent({ nft, emptyText }: Props) {
  return (
    <>
      <div>
        <Link
          href={`/token/${nftDropAddress}/${nft.metadata.id}`}
          key={nft.metadata.id}
          className={styles.nftContainer}
        >
          <ThirdwebNftMedia
            metadata={nft.metadata}
            className={styles.nftImage}
          />
        </Link>

        <p className={styles.nftTokenId}>Token ID #{nft.metadata.id}</p>
        <p className={styles.nftName}>{nft.metadata.name}</p>
      </div>
    </>
  );
}
