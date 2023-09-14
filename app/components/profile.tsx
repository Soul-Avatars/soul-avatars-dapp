import { useState, useEffect } from "react";

import styles from "./settings.module.scss";

import CloseIcon from "../icons/close.svg";
import RenameIcon from "../icons/rename.svg";
import { List, ListItem, Popover, Select } from "./ui-lib";

import { IconButton } from "./button";
import { useAppConfig, Gender } from "../store";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarPicker } from "./emoji";

export function Profile() {
  const navigate = useNavigate();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const config = useAppConfig();
  const updateConfig = config.update;

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rename = () => {
    const newName = prompt("Change Name", config.userProfile.name);
    if (newName && newName !== config.userProfile.name) {
      updateConfig((config) => (config.userProfile.name = newName));
    }
  };

  const setDone = () => {
    updateConfig((config) => (config.isUserProfileSet = true));
    navigate(Path.Home);
  };

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">Profile</div>
          <div className="window-header-sub-title">Set NFT Holder Profile</div>
        </div>
        {config.isUserProfileSet && (
          <div className="window-actions">
            <div className="window-action-button">
              <IconButton
                icon={<CloseIcon />}
                onClick={() => navigate(Path.Home)}
                bordered
                title={Locale.Settings.Actions.Close}
              />
            </div>
          </div>
        )}
      </div>
      <div className={styles["settings"]}>
        <List>
          <ListItem title={Locale.Settings.Avatar}>
            <Popover
              onClose={() => setShowEmojiPicker(false)}
              content={
                <AvatarPicker
                  onEmojiClick={(avatar: string) => {
                    updateConfig((config) => (config.avatar = avatar));
                    setShowEmojiPicker(false);
                  }}
                />
              }
              open={showEmojiPicker}
            >
              <div
                className={styles.avatar}
                onClick={() => setShowEmojiPicker(true)}
              >
                <Avatar avatar={config.avatar} />
              </div>
            </Popover>
          </ListItem>

          <ListItem title="Name" subTitle="Your NFT will know your name">
            <div onClickCapture={rename}>
              {config.userProfile.name} <RenameIcon />
            </div>
          </ListItem>

          <ListItem
            title="Gender"
            subTitle="How you would like to be addressed by your NFT"
          >
            <Select
              value={config.userProfile.gender}
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.userProfile.gender = e.target
                      .value as any as Gender),
                );
              }}
            >
              {Object.values(Gender).map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </Select>
          </ListItem>
        </List>

        {!config.isUserProfileSet && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <IconButton bordered text="Next >" onClick={setDone}></IconButton>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
