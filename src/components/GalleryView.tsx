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
  return <img src={imageUrl} alt="Album Cover" onError={handleError} />;
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

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const lastSongElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/songs`, {
        params: { lang, seed, likes, page, perPage: 20 },
      });
      setSongs((prev) => [...prev, ...res.data.songs]);
      setHasMore(res.data.songs.length > 0 && page < res.data.totalPages);
    } catch (e) {
      console.error("Failed to fetch songs", e);
    } finally {
      setLoading(false);
    }
  }, [page, lang, seed, likes, apiBaseUrl]);

  useEffect(() => {
    setSongs([]);
    setPage(1);
    setHasMore(true);
  }, [lang, seed, likes]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {songs.map((song, index) => {
          const isLast = index === songs.length - 1;
          return (
            <div
              key={song.index}
              ref={isLast ? lastSongElementRef : null}
              className="gallery-card"
            >
              <AlbumCover seed={song.coverSeed} />
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
          );
        })}
      </div>
      {loading && <div>Loading more songs...</div>}
      {!hasMore && <div>All songs loaded.</div>}
    </div>
  );
}
