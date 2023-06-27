import { ConnectWallet, useAddress } from "@thirdweb-dev/react";

import styles from "./auth-button.module.scss";
import { useEffect } from "react";
import { useAccessStore } from "../store";

export function AuthButton() {
  const accessStore = useAccessStore();
  const address = useAddress();

  useEffect(() => {
    if (!accessStore.accessCode && address) {
      accessStore.updateCode(address);
    }
    if (accessStore.accessCode && !address) {
      accessStore.updateCode("");
    }
  });

  return (
    <div className={styles.container}>
      <div className={styles.connect}>
        <ConnectWallet />
      </div>
    </div>
  );
}
