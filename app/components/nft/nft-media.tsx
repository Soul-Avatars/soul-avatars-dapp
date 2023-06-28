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
import { Modal } from "../ui-lib";

function NftModal(props: {
  modalType: number;
  isMobileScreen: boolean;
  nft: Record<string, any>;
  onClose: () => void;
}) {
  return (
    <div className="modal-mask">
      <Modal title={""} onClose={() => props.onClose()}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            src={props.nft.image}
            alt="NFT"
            width={props.isMobileScreen ? "100%" : "400px"}
            height={"auto"}
            hidden={props.isMobileScreen && props.modalType === 2}
          />
          <div
            className={
              props.isMobileScreen
                ? styles["nft-card-right-mobile"]
                : styles["nft-card-right"]
            }
            style={{
              display:
                props.isMobileScreen && props.modalType === 1 ? "none" : "flex",
            }}
          >
            <div
              className={styles["nft-attributes-container"]}
              style={{ height: "auto" }}
            >
              <div className={styles["nft-name"]}>{props.nft.name}</div>
              <div style={{ marginBottom: "16px" }}>
                {props.nft.description}
              </div>
              <div className={styles["nft-attributes"]}>
                {props.nft.attributes.map((attribute: any, index: number) => (
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
          </div>
        </div>
      </Modal>
    </div>
  );
}

export const NFTMedia = () => {
  const [nfts, setNfts] = useState<NFT[] | undefined>(undefined);
  const [modalType, setModalType] = useState<number>(1); // 1: show left, 2: show right.
  const [modalNFT, setModalNFT] = useState<Record<string, any> | undefined>();

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

  const openModal = (nft: Record<string, any>, modalType: number) => {
    setModalNFT(nft);
    setModalType(modalType);
  };
  return (
    <div style={{ flex: 1, maxHeight: "100%", overflow: "auto" }}>
      {nfts &&
        nfts
          .filter((e) => e.ownerOf.toLowerCase() === address?.toLowerCase())
          .map((nft) => {
            const nftJson = JSON.parse(nft.metadata);
            const { name, description, image, attributes } = nftJson;
            return (
              <div className={styles["nft-card"]} key={image}>
                <div
                  style={{
                    width: "240px",
                    height: "240px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={image}
                    alt="NFT"
                    className={styles["nft-image"]}
                    onClick={() => openModal(nftJson, 1)}
                  />
                </div>
                <div
                  className={
                    isMobileScreen
                      ? styles["nft-card-right-mobile"]
                      : styles["nft-card-right"]
                  }
                  onClick={() => openModal(nftJson, 2)}
                >
                  <div className={styles["nft-attributes-container"]}>
                    <div className={styles["nft-name"]}>{name}</div>
                    <div>{description}</div>
                  </div>
                  <IconButton
                    icon={<ChatIcon />}
                    text="Chat"
                    onClick={() => startChat(image)}
                  />
                </div>
              </div>
            );
          })}

      {modalNFT && (
        <NftModal
          modalType={modalType}
          isMobileScreen={isMobileScreen}
          nft={modalNFT}
          onClose={() => setModalNFT(undefined)}
        />
      )}
    </div>
  );
};
