import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Song } from "../App";
import SongsTable from "./SongsTable";
import { Download } from "lucide-react";

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
  const [isExporting, setIsExporting] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";

  useEffect(() => {
    setPage(1);
  }, [lang, seed, likes]);

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiBaseUrl}/api/songs`, {
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
  }, [lang, seed, likes, page, apiBaseUrl]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleExport = () => {
    setIsExporting(true);
    const params = new URLSearchParams({
      lang,
      seed,
      likes: String(likes),
      page: String(page),
      perPage: String(20),
    });
    window.location.href = `${apiBaseUrl}/api/export?${params.toString()}`;
    setTimeout(() => {
      setIsExporting(false);
    }, 3000);
  };

  if (isLoading) return <div className="loading-indicator">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (songs.length === 0)
    return <div className="empty-message">No songs found.</div>;

  return (
    <div className="table-wrapper">
      <SongsTable songs={songs} />
      <div className="table-footer">
        <button
          className="export-button"
          onClick={handleExport}
          disabled={isExporting}
        >
          <Download size={16} />
          {isExporting ? "Exporting..." : "Export Page"}
        </button>
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPage}
          </span>
          <button
            disabled={page >= totalPage}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
