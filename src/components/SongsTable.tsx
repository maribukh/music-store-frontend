import React, { useState, useRef, useEffect } from "react";

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

export default function SongsTable({
  songs,
  page,
  setPage,
  totalPage,
}: {
  songs: any[];
  page: number;
  setPage: (p: number) => void;
  totalPage: number;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [playingState, setPlayingState] = useState<{
    seed: string | null;
    status: "playing" | "loading" | "paused" | "error";
  }>({ seed: null, status: "paused" });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlay = async (seed: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    if (playingState.seed === seed && playingState.status === "playing") {
      setPlayingState({ seed, status: "paused" });
      return;
    }

    try {
      setPlayingState({ seed, status: "loading" });

      // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Заменяем ":" на "-"
      const safeSeed = seed.replace(/:/g, "-");
      const response = await fetch(`/api/songs/preview/${safeSeed}`);

      if (!response.ok) throw new Error("Network response was not ok");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      await newAudio.play();

      setPlayingState({ seed, status: "playing" });

      newAudio.onended = () => {
        setPlayingState({ seed: null, status: "paused" });
        audioRef.current = null;
      };
    } catch (error) {
      console.error("Error fetching or playing audio:", error);
      setPlayingState({ seed, status: "error" });
    }
  };

  return (
    <div className="table-card">
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
            <div className="cell title">{s.title}</div>
            <div className="cell">{s.artist}</div>
            <div className="cell">{s.album}</div>
            <div className="cell">{s.genre}</div>
            <div className="cell">{s.likes}</div>
            {expanded === s.index && (
              <div className="expanded">
                <AlbumCover seed={s.coverSeed} />
                <div className="review">
                  <p>
                    <strong>{s.title}</strong> by {s.artist}
                  </p>
                  <p>{s.review}</p>
                </div>
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(s.coverSeed);
                    }}
                    disabled={
                      playingState.status === "loading" &&
                      playingState.seed === s.coverSeed
                    }
                  >
                    {playingState.status === "loading" &&
                    playingState.seed === s.coverSeed
                      ? "Loading..."
                      : playingState.status === "playing" &&
                        playingState.seed === s.coverSeed
                      ? "Pause"
                      : "Play"}
                  </button>
                  {playingState.status === "error" &&
                    playingState.seed === s.coverSeed && (
                      <span style={{ color: "red", marginLeft: "10px" }}>
                        Error
                      </span>
                    )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}
