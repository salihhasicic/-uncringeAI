import { useEffect, useState } from "react";

const loadingMessages = [
  "Diagnosing cringe...",
  "Checking for ChatGPT smell...",
  "Rewriting human..."
];

export default function LoadingState({ mode }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % loadingMessages.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="loading-card">
      <div>
        <div className="loading-orb" />
        <h3>{mode === "screenshot" ? "Reading the screenshot" : "Reading the room"}</h3>
        <p className="loading-message">{loadingMessages[index]}</p>
      </div>
    </div>
  );
}
