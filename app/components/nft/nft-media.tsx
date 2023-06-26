import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import styles from "./nft-media.module.scss";
import { IconButton } from "../button";
import ChatIcon from "../../icons/chat.svg";
import { Path } from "../../constant";
import { Mask } from "../../store/mask";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store";

interface NFT {
  tokenAddress: string;
  tokenId: string;
  amount: string;
  ownerOf: string;
  tokenHash: string;
  blockNumberMinted: string;
  blockNumber: string;
  contractType: string;
  name: string;
  symbol: string;
  metadata: string;
  minterAddress: string;
}

export const NFTMedia = () => {
  const [nfts, setNfts] = useState<NFT[] | undefined>(undefined);
  const chatStore = useChatStore();
  const navigate = useNavigate();

  const startChat = (mask?: Mask) => {
    chatStore.newSession(mask);
    setTimeout(() => navigate(Path.Chat), 1);
  };

  useEffect(() => {
    async function fetchNfts() {
      const response = await fetch(`/api/nft`);
      const data = await response.json();
      setNfts(data.owners);
    }
    fetchNfts();
  }, []);

  const address = useAddress();
  return (
    <div>
      {nfts &&
        nfts
          .filter((e) => e.ownerOf.toLowerCase() === address?.toLowerCase())
          .map((nft, i) => {
            const { img, attributes } = JSON.parse(nft.metadata);
            return (
              <div className={styles["nft-card"]} key={i}>
                <Image
                  src={img}
                  alt="NFT"
                  className={styles["nft-image"]}
                  width={240}
                  height={240}
                />
                <div className={styles["nft-card-right"]}>
                  <div className={styles["nft-attributes"]}>
                    {attributes.map((attribute: any, index: number) => (
                      <div key={index} className={styles["nft-attribute"]}>
                        <span className={styles["nft-attribute-label"]}>
                          {attribute.trait_type}:
                        </span>
                        <span className={styles["nft-attribute-value"]}>
                          {attribute.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <IconButton
                    icon={<ChatIcon />}
                    text="Chat"
                    onClick={() => startChat()}
                  />
                </div>
              </div>
            );
          })}
    </div>
  );
};
