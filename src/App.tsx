import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import TableView from "./components/TableView";
import GalleryView from "./components/GalleryView";

export type Song = {
  lyrics: string;
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
