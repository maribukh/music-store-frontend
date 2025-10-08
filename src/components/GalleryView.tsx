import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Song } from "../App";

const AlbumCover = ({ seed }: { seed: string }) => {
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
  const imageUrl = `https://picsum.photos/id/${imageId}/300/300`;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = `https://picsum.photos/seed/${seed}/300/300`;
  };

  return (
    <img
      src={imageUrl}
      alt="Album Cover"
      className="gallery-cover"
      onError={handleError}
    />
  );
};

export default function GalleryView({
  lang,
  seed,
  likes,
}: {
  lang: string;
  seed: string;
  likes: number;
}) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();

  const lastSongElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    setSongs([]);
    setPage(1);
    setHasMore(true);
  }, [lang, seed, likes]);

  useEffect(() => {
    if (!hasMore) return;
    setLoading(true);
    axios
      .get("/api/songs", {
        params: { lang, seed, likes, page, perPage: 20 },
      })
      .then((res) => {
        setSongs((prevSongs) => {
          const newSongs = res.data.songs;
          const existingIds = new Set(prevSongs.map((s) => s.index));
          return [
            ...prevSongs,
            ...newSongs.filter((s: Song) => !existingIds.has(s.index)),
          ];
        });
        setHasMore(res.data.songs.length > 0 && page < res.data.totalPages);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to fetch songs", e);
        setLoading(false);
      });
  }, [page, lang, seed, likes]);

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {songs.map((song, index) => {
          const cardContent = (
            <>
              <AlbumCover seed={song.coverSeed} />
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </>
          );

          if (songs.length === index + 1) {
            return (
              <div
                ref={lastSongElementRef}
                key={`${seed}-${song.index}`}
                className="gallery-card"
              >
                {cardContent}
              </div>
            );
          } else {
            return (
              <div key={`${seed}-${song.index}`} className="gallery-card">
                {cardContent}
              </div>
            );
          }
        })}
      </div>
      {loading && <p className="loading-indicator">Loading more songs...</p>}
      {!hasMore && songs.length > 0 && (
        <p className="empty-message">🎉 All songs loaded</p>
      )}
    </div>
  );
}
