import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import styles from "./nft-media.module.scss";
import { IconButton } from "../button";
import ChatIcon from "../../icons/chat.svg";
import RenameIcon from "../../icons/rename.svg";
import { Path, allVoices } from "../../constant";
import { useMaskStore } from "../../store/mask";
import { useNavigate } from "react-router-dom";
import { useAppConfig, useChatStore } from "../../store";
import { generateNFTMask } from "../../masks/nft";
import { NFT } from "@/app/typing";
import { useMobileScreen } from "@/app/utils";
import { List, ListItem, Modal, Select } from "../ui-lib";
import stylesLib from "../ui-lib.module.scss";

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
  const [showNftSetup, setShowNftSetup] = useState<
    Record<string, any> | undefined
  >();

  const chatStore = useChatStore();
  const maskStore = useMaskStore();
  const navigate = useNavigate();
  const isMobileScreen = useMobileScreen();

  const startChat = (nftJson: Record<string, any>) => {
    const existChatIndex = chatStore.sessions.findIndex(
      (session) => session.mask.avatar === nftJson.image,
    );
    if (existChatIndex > -1) {
      chatStore.selectSession(existChatIndex);
      setTimeout(() => navigate(Path.Chat), 1);
    } else {
      setShowNftSetup(nftJson);
    }
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
                    onClick={(e) => {
                      e.stopPropagation();
                      startChat(nftJson);
                    }}
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

      {showNftSetup && (
        <NftSetupModal
          nft={showNftSetup}
          onClose={() => setShowNftSetup(undefined)}
        />
      )}
    </div>
  );
};

const audio = new Audio();

export function NftSetupModal(props: {
  nft: Record<string, any>;
  onClose: () => void;
}) {
  const config = useAppConfig();
  const updateConfig = config.update;

  const chatStore = useChatStore();
  const maskStore = useMaskStore();
  const navigate = useNavigate();

  const doStartChat = (nftJson: Record<string, any>) => {
    const nftMask = maskStore.getAll().find((e) => e.avatar === nftJson.image);
    chatStore.newSession(nftMask || undefined);
    setTimeout(() => navigate(Path.Chat), 1);
  };

  function playSelectedVoice(voice: string) {
    audio.src = `/voices/${voice}.wav`;

    audio.pause();
    audio.play();
  }

  const nftId = props.nft.image;
  const defaultRelationship = "Romantic partner";
  return (
    <div className="modal-mask">
      <Modal
        title={"Setup Chatbot"}
        onClose={() => props.onClose()}
        actions={[
          <IconButton
            key={1}
            bordered
            text="Okay !"
            onClick={() => {
              if (!config.nftConfig[nftId]) {
                if (props.nft.name) {
                  updateConfig((config) => {
                    config.nftConfig[nftId] = {
                      id: nftId,
                      name: props.nft.name,
                      relationship: defaultRelationship,
                      voice: Object.values(allVoices)[0],
                    };
                  });
                  doStartChat(props.nft);
                }
              } else {
                doStartChat(props.nft);
              }
            }}
          ></IconButton>,
        ]}
      >
        <div className={styles["settings"]}>
          <span>Basic</span>
          <List>
            <ListItem title="Name" subTitle="Give your NFT a name">
              <div
                onClickCapture={() => {
                  const newName = prompt("NFT Name", props.nft.name);
                  if (newName) {
                    updateConfig((config) => {
                      if (config.nftConfig[nftId]) {
                        config.nftConfig[nftId].name = newName;
                      } else {
                        config.nftConfig[nftId] = {
                          id: nftId,
                          name: newName,
                          relationship: defaultRelationship,
                          voice: Object.values(allVoices)[0],
                        };
                      }
                    });
                  }
                }}
              >
                {(config.nftConfig[nftId] || {}).name || props.nft.name}{" "}
                <RenameIcon />
              </div>
            </ListItem>

            <ListItem
              title="Relationship"
              subTitle="Set your desired relationship with NFT"
            >
              <div
                onClickCapture={() => {
                  const input = prompt("Relationship", defaultRelationship);
                  if (input) {
                    updateConfig((config) => {
                      if (config.nftConfig[nftId]) {
                        config.nftConfig[nftId].relationship = input;
                      } else {
                        config.nftConfig[nftId] = {
                          id: nftId,
                          name: props.nft.name,
                          relationship: input,
                          voice: Object.values(allVoices)[0],
                        };
                      }
                    });
                  }
                }}
              >
                {(config.nftConfig[nftId] || {}).relationship ||
                  defaultRelationship}{" "}
                <RenameIcon />
              </div>
            </ListItem>

            <ListItem title="Voice" subTitle="How your NFT sounds like">
              <Select
                value={
                  config.nftConfig[nftId]?.voice || Object.values(allVoices)[0]
                }
                onChange={(e) => {
                  updateConfig((config) => {
                    if (config.nftConfig[nftId]) {
                      config.nftConfig[nftId].voice = e.target.value;
                    } else {
                      config.nftConfig[nftId] = {
                        id: nftId,
                        name: props.nft.name,
                        relationship: defaultRelationship,
                        voice: e.target.value,
                      };
                    }
                  });

                  playSelectedVoice(e.target.value);
                }}
              >
                {Object.keys(allVoices).map((v) => (
                  <option value={allVoices[v]} key={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </ListItem>
          </List>

          <span>Tags</span>
          <div className={stylesLib.list} style={{ padding: 16 }}>
            <div className={styles["nft-attributes"]}>
              {props.nft.attributes?.map((attribute: any, index: number) => (
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
      </Modal>
    </div>
  );
}
