import React from "react";

export default function WaveAnimation() {
  return (
    <div className="wave-container">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="wave-bar"
          style={{ animationDelay: `${i * 0.15}s` }}
        ></div>
      ))}
    </div>
  );
}
