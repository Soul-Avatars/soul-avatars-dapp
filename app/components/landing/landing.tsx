import React from "react";
import styles from "./landing.module.scss";
import { useNavigate } from "react-router-dom";
import { Path } from "@/app/constant";
import ImageGrid from "./image-grid";

const StartButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.startButton}>
      <button onClick={() => navigate(Path.Home)}>Chat with NFT 💬</button>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToFeatureSection = () => {
    const featureSection = document.getElementById("feature");
    if (featureSection) {
      featureSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <img src="/logo.jpeg" alt="SoulAvatars" />
            <h1>SoulAvatars</h1>
          </div>

          <div className={styles.navigation}></div>

          <div className={styles.navButton}>
            <StartButton />
          </div>
        </nav>
      </header>

      <div className={styles.bg}></div>

      <div className={styles.content}>
        <div className={`${styles.section} ${styles["empty-section"]}`}>.</div>
        <div className={`${styles.section} ${styles["intro-section"]}`}>
          {/* Left section */}
          <div>
            <h1 className={styles.title}>Finally,</h1>
            <h1 className={styles.title}> your NFTs come alive!</h1>
            <div style={{ height: 40 }}></div>
            <h2>
              Have natural conversations with your NFTs through our AI-powered
              platform.
            </h2>
            <h2>Customize relationships and interact via text or voice.</h2>
            <StartButton />
          </div>

          {/* Right section */}
          <div className={styles["intro-section-right"]}>
            <img
              src="/screen1.jpg"
              className={styles["intro-img-1"]}
              alt="Product Screenshot"
            />
            <img src="/screen2.jpg" alt="Product Screenshot" />
          </div>
        </div>

        <div
          id="feature"
          className={`${styles.section} ${styles["feature-section"]}`}
        >
          <ImageGrid />
        </div>
      </div>

      <footer className={styles.footer}>
        <p>
          Copyright &copy; {new Date().getFullYear()} SoulAvatars Team. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
