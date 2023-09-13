import React, { useState, useEffect } from "react";
import AudioIcon from "../../icons/audio.svg";

interface AudioButtonProps {
  audioBase64: string; // Base64 string of the .wav audio
}

const AudioButton: React.FC<AudioButtonProps> = ({ audioBase64 }) => {
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );

  useEffect(() => {
    createAudioElement();
  }, []);

  const createAudioElement = () => {
    console.log("create element");
    try {
      const audioURL = `data:audio/mp3;base64,${audioBase64}`;
      const newAudioElement = new Audio(audioURL);
      setAudioElement(newAudioElement);
    } catch (error) {
      console.error("Error creating audio element:", error);
    }
  };

  const handleClick = () => {
    if (audioElement?.paused) {
      audioElement.play();
    } else {
      audioElement?.pause();
    }
  };

  return (
    <div onClick={handleClick}>
      <AudioIcon style={{ transform: "rotate(90deg)", width: "24px" }} />
    </div>
  );
};

export default AudioButton;
