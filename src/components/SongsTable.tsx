import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Song } from "../App";
import LyricsViewer from "./LyricsViewer";

const AlbumCover = ({ seed, size = 150 }: { seed: string; size?: number }) => {
  const hashCode = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  const imageId = hashCode(seed) % 1000;
  const imageUrl = `https://picsum.photos/id/${imageId}/${size}/${size}`;
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/seed/${seed}/${size}/${size}`;
  };
  return (
    <img
      src={imageUrl}
      alt="Album Cover"
      width={size}
      height={size}
      onError={handleError}
    />
  );
};

export default function SongsTable({ songs }: { songs: Song[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [playingState, setPlayingState] = useState<{
    seed: string | null;
    status: "playing" | "loading" | "paused" | "error";
  }>({ seed: null, status: "paused" });
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handlePlay = async (seed: string) => {
    if (playingState.seed === seed && playingState.status === "playing") {
      audioRef.current?.pause();
      setPlayingState({ seed, status: "paused" });
      return;
    }

    if (playingState.seed === seed && playingState.status === "paused") {
      await audioRef.current?.play();
      return;
    }

    if (audioRef.current) audioRef.current.pause();

    try {
      setPlayingState({ seed, status: "loading" });
      setCurrentTime(0);

      const safeSeed = seed.replace(/:/g, "-");
      const response = await fetch(
        `${apiBaseUrl}/api/songs/preview/${safeSeed}`
      );
      if (!response.ok) throw new Error("Network response was not ok");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;

      newAudio.onplaying = () => setPlayingState({ seed, status: "playing" });
      newAudio.ontimeupdate = () => setCurrentTime(newAudio.currentTime);
      newAudio.onended = () => {
        setPlayingState({ seed: null, status: "paused" });
        setCurrentTime(0);
        audioRef.current = null;
      };
      newAudio.onerror = () => setPlayingState({ seed, status: "error" });

      await newAudio.play();
    } catch (error) {
      console.error("Error fetching or playing audio:", error);
      setPlayingState({ seed, status: "error" });
    }
  };

  return (
    <div className="table-card-body">
      <div className="table-header">
        <div>Title</div>
        <div>Artist</div>
        <div>Album</div>
        <div>Genre</div>
        <div>Likes</div>
      </div>

      <div className="table-body">
        {songs.map((s) => (
          <div
            key={s.index}
            className="table-row"
            onClick={() => setExpanded(expanded === s.index ? null : s.index)}
          >
            <div>{s.title}</div>
            <div>{s.artist}</div>
            <div>{s.album}</div>
            <div>{s.genre}</div>
            <div>{s.likes}</div>

            {expanded === s.index && (
              <div className="expanded">
                <AlbumCover seed={s.coverSeed} />
                <LyricsViewer
                  lyrics={s.lyrics}
                  currentTime={
                    playingState.seed === s.coverSeed ? currentTime : 0
                  }
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(s.coverSeed);
                  }}
                >
                  {playingState.status === "playing" &&
                  playingState.seed === s.coverSeed ? (
                    <Pause />
                  ) : (
                    <Play />
                  )}
                </button>
                {playingState.status === "error" && <span>Error</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
