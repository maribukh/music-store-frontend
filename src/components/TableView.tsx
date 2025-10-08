import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Song } from "../App";
import SongsTable from "./SongsTable";

export default function TableView({
  lang,
  seed,
  likes,
}: {
  lang: string;
  seed: string;
  likes: number;
}) {
  const [page, setPage] = useState(1);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [lang, seed]);

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/songs", {
        params: { lang, seed, likes, page, perPage: 20 },
      });
      setSongs(res.data.songs);
      setTotalPage(res.data.totalPages);
    } catch (e) {
      console.error("Error fetching songs:", e);
      setError(
        "Failed to load data. Please check if the backend server is running."
      );
      setSongs([]);
    } finally {
      setIsLoading(false);
    }
  }, [lang, seed, likes, page]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  if (isLoading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (songs.length === 0)
    return <div className="empty-message">No songs found.</div>;

  return (
    <SongsTable
      songs={songs}
      page={page}
      setPage={setPage}
      totalPage={totalPage}
    />
  );
}
