import React from "react";
import styles from "./feature-card.module.scss";

interface CardProps {
  imageUrl: string;
  title: string;
  description: string;
  style: Record<string, any>;
}

const FeatureCard: React.FC<CardProps> = ({
  imageUrl,
  title,
  description,
  style,
}) => {
  return (
    <div
      className={styles["card-container"]}
      style={{ ...style, backgroundImage: `url(${imageUrl})` }}
    >
      <div className={styles["card-content"]}>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
