import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import GalleryView from "./components/GalleryView";
import TableView from "./components/TableView";
import "./styles.css";

type ViewMode = "table" | "gallery";

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

export default function App() {
  const [lang, setLang] = useState("en");
  const [seed, setSeed] = useState("0");
  const [likes, setLikes] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

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
          onClick={() => setViewMode("table")}
          className={viewMode === "table" ? "active" : ""}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("gallery")}
          className={viewMode === "gallery" ? "active" : ""}
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
