import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import styles from "./nft-media.module.scss";
import { IconButton } from "../button";
import ChatIcon from "../../icons/chat.svg";
import { Path } from "../../constant";
import { useMaskStore } from "../../store/mask";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store";
import { generateNFTMask } from "../../masks/nft";
import { NFT } from "@/app/typing";
import { useMobileScreen } from "@/app/utils";

export const NFTMedia = () => {
  const [nfts, setNfts] = useState<NFT[] | undefined>(undefined);
  const chatStore = useChatStore();
  const maskStore = useMaskStore();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const startChat = (id: string) => {
    const existChatIndex = chatStore.sessions.findIndex(
      (session) => session.mask.avatar === id,
    );
    if (existChatIndex > -1) {
      chatStore.selectSession(existChatIndex);
      setTimeout(() => navigate(Path.Chat), 1);
      return;
    }

    const nftMask = maskStore.getAll().find((e) => e.avatar === id);
    chatStore.newSession(nftMask || undefined);
    setTimeout(() => navigate(Path.Chat), 1);
  };

  useEffect(() => {
    if (nfts) return;

    async function fetchNfts() {
      const response = await fetch(`/api/nft`);
      const data = await response.json();
      setNfts(data.owners);
      maskStore.getAll().forEach((mask) => {
        maskStore.delete(mask.id);
      });
      data.owners.forEach((e: any, i: number) => {
        const nftMask = generateNFTMask(i, e);
        maskStore.create(nftMask);
      });
    }
    fetchNfts();
  }, [maskStore, nfts]);

  const address = useAddress();
  return (
    <div style={{ flex: 1 }}>
      {nfts &&
        nfts
          .filter((e) => e.ownerOf.toLowerCase() === address?.toLowerCase())
          .map((nft) => {
            const { img, attributes } = JSON.parse(nft.metadata);
            return (
              <div className={styles["nft-card"]} key={img}>
                <Image
                  src={img}
                  alt="NFT"
                  className={styles["nft-image"]}
                  width={240}
                  height={240}
                />
                <div
                  className={
                    isMobileScreen
                      ? styles["nft-card-right-mobile"]
                      : styles["nft-card-right"]
                  }
                >
                  <div className={styles["nft-attributes-container"]}>
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
                  </div>
                  <IconButton
                    icon={<ChatIcon />}
                    text="Chat"
                    onClick={() => startChat(img)}
                  />
                </div>
              </div>
            );
          })}
    </div>
  );
};
