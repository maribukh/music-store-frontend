import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import WaveAnimation from "./WaveAnimation";
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
      className="cover-image"
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
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
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

    if (audioRef.current) {
      audioRef.current.pause();
    }

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

      newAudio.onplaying = () => {
        setPlayingState({ seed, status: "playing" });
      };

      newAudio.ontimeupdate = () => {
        setCurrentTime(newAudio.currentTime);
      };

      newAudio.onended = () => {
        setPlayingState({ seed: null, status: "paused" });
        setCurrentTime(0);
        audioRef.current = null;
      };

      newAudio.onerror = () => {
        console.error("Error playing audio");
        setPlayingState({ seed, status: "error" });
      };

      await newAudio.play();
    } catch (error) {
      console.error("Error fetching or playing audio:", error);
      setPlayingState({ seed, status: "error" });
    }
  };

  return (
    <div className="table-card-body">
      <div className="table-header">
        <div data-label="Title">Title</div>
        <div data-label="Artist">Artist</div>
        <div data-label="Album">Album</div>
        <div data-label="Genre">Genre</div>
        <div data-label="Likes">Likes</div>
      </div>

      <div className="table-body">
        {songs.map((s) => (
          <div
            key={s.index}
            className="table-row"
            onClick={() => setExpanded(expanded === s.index ? null : s.index)}
          >
            <div className="cell title" data-label="Title">
              {s.title}
            </div>
            <div className="cell" data-label="Artist">
              {s.artist}
            </div>
            <div className="cell" data-label="Album">
              {s.album}
            </div>
            <div className="cell" data-label="Genre">
              {s.genre}
            </div>
            <div className="cell" data-label="Likes">
              {s.likes}
            </div>

            {expanded === s.index && (
              <div className="expanded">
                <AlbumCover seed={s.coverSeed} />
                <div className="review-and-lyrics">
                  <div className="review">
                    <p>
                      <strong>{s.title}</strong> by {s.artist}
                    </p>
                    <p>{s.review}</p>
                  </div>
                  <LyricsViewer
                    lyrics={s.lyrics}
                    currentTime={
                      playingState.seed === s.coverSeed ? currentTime : 0
                    }
                  />
                </div>

                <div className="audio-controls">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(s.coverSeed);
                    }}
                    disabled={
                      playingState.status === "loading" &&
                      playingState.seed === s.coverSeed
                    }
                    className="play-button"
                  >
                    {playingState.status === "loading" &&
                    playingState.seed === s.coverSeed ? (
                      "..."
                    ) : playingState.status === "playing" &&
                      playingState.seed === s.coverSeed ? (
                      <Pause size={22} />
                    ) : (
                      <Play size={22} />
                    )}
                  </button>

                  {playingState.status === "playing" &&
                    playingState.seed === s.coverSeed && <WaveAnimation />}

                  {playingState.status === "error" &&
                    playingState.seed === s.coverSeed && (
                      <span className="play-error">Error</span>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
