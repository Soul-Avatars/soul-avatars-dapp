import { ConnectWallet } from "@thirdweb-dev/react";

import styles from "./auth-button.module.scss";

export function AuthButton() {
  return (
    <div className={styles.container}>
      <div className={styles.connect}>
        <ConnectWallet />
      </div>
    </div>
  );
}
