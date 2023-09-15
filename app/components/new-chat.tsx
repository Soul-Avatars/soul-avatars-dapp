import { useEffect, useRef, useState } from "react";
import { ChainName, Path, SlotID } from "../constant";
import { IconButton } from "./button";
import styles from "./new-chat.module.scss";

import LeftIcon from "../icons/left.svg";
import AddIcon from "../icons/add.svg";
import EyeIcon from "../icons/eye.svg";
import SearchIcon from "../icons/search.svg";

import { useNavigate } from "react-router-dom";
import { Mask, useMaskStore } from "../store/mask";
import Locale from "../locales";
import { useChatStore } from "../store";
import { MaskAvatar } from "./mask";
import { useCommand } from "../command";
import { NFTMedia } from "./nft/nft-media";
import { Modal, Select } from "./ui-lib";

function getIntersectionArea(aRect: DOMRect, bRect: DOMRect) {
  const xmin = Math.max(aRect.x, bRect.x);
  const xmax = Math.min(aRect.x + aRect.width, bRect.x + bRect.width);
  const ymin = Math.max(aRect.y, bRect.y);
  const ymax = Math.min(aRect.y + aRect.height, bRect.y + bRect.height);
  const width = xmax - xmin;
  const height = ymax - ymin;
  const intersectionArea = width < 0 || height < 0 ? 0 : width * height;
  return intersectionArea;
}

function MaskItem(props: { mask: Mask; onClick?: () => void }) {
  return (
    <div className={styles["mask"]} onClick={props.onClick}>
      <MaskAvatar mask={props.mask} />
      <div className={styles["mask-name"] + " one-line"}>{props.mask.name}</div>
    </div>
  );
}

function useMaskGroup(masks: Mask[]) {
  const [groups, setGroups] = useState<Mask[][]>([]);

  useEffect(() => {
    const computeGroup = () => {
      const appBody = document.getElementById(SlotID.AppBody);
      if (!appBody || masks.length === 0) return;

      const rect = appBody.getBoundingClientRect();
      const maxWidth = rect.width;
      const maxHeight = rect.height * 0.6;
      const maskItemWidth = 120;
      const maskItemHeight = 50;

      const randomMask = () => masks[Math.floor(Math.random() * masks.length)];
      let maskIndex = 0;
      const nextMask = () => masks[maskIndex++ % masks.length];

      const rows = Math.ceil(maxHeight / maskItemHeight);
      const cols = Math.ceil(maxWidth / maskItemWidth);

      const newGroups = new Array(rows)
        .fill(0)
        .map((_, _i) =>
          new Array(cols)
            .fill(0)
            .map((_, j) => (j < 1 || j > cols - 2 ? randomMask() : nextMask())),
        );

      setGroups(newGroups);
    };

    computeGroup();

    window.addEventListener("resize", computeGroup);
    return () => window.removeEventListener("resize", computeGroup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return groups;
}

export function NewChat() {
  const chatStore = useChatStore();
  const maskStore = useMaskStore();

  const masks = maskStore.getAll();
  const groups = useMaskGroup(masks);

  const navigate = useNavigate();

  const maskRef = useRef<HTMLDivElement>(null);

  const [showAddNFT, setShowAddNFT] = useState(false);

  const startChat = (mask?: Mask) => {
    chatStore.newSession(mask);
    setTimeout(() => navigate(Path.Chat), 1);
  };

  useCommand({
    mask: (id) => {
      try {
        const mask = maskStore.get(parseInt(id));
        startChat(mask ?? undefined);
      } catch {
        console.error("[New Chat] failed to create chat from mask id=", id);
      }
    },
  });

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.scrollLeft =
        (maskRef.current.scrollWidth - maskRef.current.clientWidth) / 2;
    }
  }, [groups]);

  return (
    <div className={styles["new-chat"]}>
      <div className={styles["mask-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text={Locale.NewChat.Return}
          onClick={() => navigate(Path.Home)}
        ></IconButton>

        <IconButton
          icon={<AddIcon />}
          text="Add NFT"
          bordered
          onClick={() => setShowAddNFT(true)}
        ></IconButton>
      </div>

      <div className={styles["title"]}>{Locale.NewChat.Title}</div>
      <div className={styles["sub-title"]}>{Locale.NewChat.SubTitle}</div>

      <div className={styles["actions"]}>
        <IconButton
          text="Find more on OpenSea"
          onClick={() =>
            window.open(
              "https://testnets.opensea.io/collection/soulavatars",
              "_blank",
            )
          }
          icon={<EyeIcon />}
          bordered
          shadow
        />
      </div>

      <NFTMedia />

      {showAddNFT && <AddNFTModal onClose={() => setShowAddNFT(false)} />}
    </div>
  );
}

function AddNFTModal(props: { onClose: () => void }) {
  const [chainName, setChainName] = useState("goerli");

  return (
    <div className="modal-mask">
      <Modal
        title={"Add NFT"}
        onClose={() => props.onClose()}
        actions={[
          <IconButton
            key={1}
            bordered
            text="Okay !"
            onClick={() => props.onClose()}
          ></IconButton>,
        ]}
      >
        <div className={styles["add-nft-row"]}>
          <span style={{ marginRight: 8 }}>Network </span>

          <Select
            value={chainName}
            onChange={(e) => {
              setChainName(e.target.value as any);
            }}
          >
            {Object.values(ChainName).map((chain) => (
              <option value={chain} key={chain}>
                {chain}
              </option>
            ))}
          </Select>

          <span style={{ flex: 1 }}></span>
          <input
            type="text"
            // value={prompt.title}
            // readOnly={!prompt.isUser}
            className={styles["contract-search"]}
            placeholder="Contract Address"
            // onInput={(e) =>
            //   promptStore.update(
            //     props.id,
            //     (prompt) => (prompt.title = e.currentTarget.value),
            //   )
            // }
          ></input>

          <IconButton icon={<SearchIcon />} bordered />
        </div>
      </Modal>
    </div>
  );
}
