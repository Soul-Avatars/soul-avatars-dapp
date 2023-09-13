import React from "react";
import styles from "./image-grid.module.scss";

const ImageGrid: React.FC = () => {
  return (
    <div className={styles.imageGrid}>
      <div className={styles.row}>
        {Array.from({ length: 10 }).map((_, index) => (
          <img
            key={index}
            src={`avatars/${index + 1}.png`} // Replace with your image source
            alt={`Image ${index + 1}`}
            className={styles.image}
          />
        ))}
      </div>
      <div className={styles.row2}>
        {Array.from({ length: 10 }).map((_, index) => (
          <img
            key={index}
            src={`avatars/${index + 11}.png`} // Replace with your image source
            alt={`Image ${index + 11}`}
            className={styles.image}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGrid;
