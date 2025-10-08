import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Toolbar from "./components/Toolbar";
import SongsTable from "./components/SongsTable";
import GalleryView from "./components/GalleryView";
import { Download } from "lucide-react";

export type Song = {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  coverSeed: string;
  review: string;
};

const TableView = ({
  lang,
  seed,
  likes,
}: {
  lang: string;
  seed: string;
  likes: number;
}) => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [lang, seed, likes]);

  const fetchSongs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/songs", {
        params: { lang, seed, likes, page, perPage },
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
  }, [lang, seed, likes, page, perPage]);

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
      perPage: String(perPage),
    });
    window.location.href = `/api/export?${params.toString()}`;
    setTimeout(() => {
      setIsExporting(false);
    }, 3000);
  };

  return (
    <>
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && !error && songs.length > 0 && (
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
      )}
      {!isLoading && !error && songs.length === 0 && (
        <div className="empty-message">No songs found.</div>
      )}
    </>
  );
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [seed, setSeed] = useState("0");
  const [likes, setLikes] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");

  return (
    <div className="container">
      <h1 className="title">Music Store Showcase</h1>
      <Toolbar
        lang={lang}
        setLang={setLang}
        seed={seed}
        setSeed={setSeed}
        likes={likes}
        setLikes={setLikes}
      />
      <div className="view-switcher">
        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() => setViewMode("table")}
        >
          Table View
        </button>
        <button
          className={viewMode === "gallery" ? "active" : ""}
          onClick={() => setViewMode("gallery")}
        >
          Gallery View
        </button>
      </div>
      {viewMode === "table" ? (
        <TableView lang={lang} seed={seed} likes={likes} />
      ) : (
        <GalleryView lang={lang} seed={seed} likes={likes} />
      )}
    </div>
  );
}
