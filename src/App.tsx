import React, { useEffect, useState } from "react";
import Toolbar from "./components/Toolbar";
import SongsTable from "./components/SongsTable";
import axios from "axios";

type Song = {
  index: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  coverSeed: string;
  review: string;
};

export default function App() {
  const [lang, setLang] = useState("en");
  const [seed, setSeed] = useState("0");
  const [likes, setLikes] = useState(1);
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [songs, setSongs] = useState<Song[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [lang, seed]);

  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/songs", {
          params: { lang, seed, likes, page, perPage },
        });
        setSongs(res.data.songs);
        setTotalPage(10); // Placeholder
      } catch (e) {
        console.error("Error fetching songs:", e);
        setError(
          "Failed to load data. Please check if the backend server is running."
        );
        setSongs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [lang, seed, likes, page, perPage]);

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
      {isLoading && <div className="loading-indicator">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && !error && songs.length > 0 && (
        <SongsTable
          songs={songs}
          page={page}
          setPage={setPage}
          totalPage={totalPage}
        />
      )}
      {!isLoading && !error && songs.length === 0 && (
        <div className="empty-message">No songs found.</div>
      )}
    </div>
  );
}
