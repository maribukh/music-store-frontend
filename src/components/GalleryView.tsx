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
    (node) => {
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

  const fetchSongs = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      try {
        const res = await axios.get("/api/songs", {
          params: { lang, seed, likes, page: currentPage, perPage: 20 },
        });
        const newSongs = res.data.songs;
        setSongs((prev) =>
          currentPage === 1 ? newSongs : [...prev, ...newSongs]
        );
        setHasMore(currentPage < res.data.totalPages);
      } catch (e) {
        console.error("Failed to fetch songs", e);
      } finally {
        setLoading(false);
      }
    },
    [lang, seed, likes]
  );

  useEffect(() => {
    setSongs([]);
    setPage(1);
    setHasMore(true);
  }, [lang, seed, likes]);

  useEffect(() => {
    fetchSongs(page);
  }, [page, fetchSongs]);

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {songs.map((song, index) => {
          if (songs.length === index + 1) {
            return (
              <div
                ref={lastSongElementRef}
                key={song.index}
                className="gallery-card"
              >
                <AlbumCover seed={song.coverSeed} />
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            );
          } else {
            return (
              <div key={song.index} className="gallery-card">
                <AlbumCover seed={song.coverSeed} />
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            );
          }
        })}
      </div>

      {loading && (
        <div className="loading-indicator">Loading more songs...</div>
      )}
      {!hasMore && (
        <div className="empty-message">You have reached the end!</div>
      )}
    </div>
  );
}
