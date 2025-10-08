import React, { useMemo, useEffect, useRef } from "react";

type LyricLine = {
  time: number;
  text: string;
};

function parseLyrics(lyrics: string): LyricLine[] {
  return lyrics
    .split("\n")
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2}\.\d{2})\](.*)/);
      if (!match) return null;
      const [, minutes, seconds, text] = match;
      const time = parseInt(minutes, 10) * 60 + parseFloat(seconds);
      return { time, text: text.trim() };
    })
    .filter((line): line is LyricLine => line !== null);
}

export default function LyricsViewer({
  lyrics,
  currentTime,
}: {
  lyrics: string;
  currentTime: number;
}) {
  const parsedLyrics = useMemo(() => parseLyrics(lyrics), [lyrics]);
  const activeLineRef = useRef<HTMLParagraphElement>(null);

  let activeLineIndex = -1;
  for (let i = parsedLyrics.length - 1; i >= 0; i--) {
    if (currentTime >= parsedLyrics[i].time) {
      activeLineIndex = i;
      break;
    }
  }

  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLineIndex]);

  return (
    <div className="lyrics-container">
      {parsedLyrics.map((line, index) => (
        <p
          key={index}
          ref={index === activeLineIndex ? activeLineRef : null}
          className={`lyric-line ${index === activeLineIndex ? "active" : ""}`}
        >
          {line.text}
        </p>
      ))}
    </div>
  );
}
