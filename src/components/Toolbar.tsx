
import React from "react";

export default function Toolbar({ lang, setLang, seed, setSeed, likes, setLikes }:
  { lang: string; setLang: (s:string)=>void; seed:string; setSeed:(s:string)=>void; likes:number; setLikes:(n:number)=>void }) {

  return (
    <div className="toolbar">
      <div className="form-row">
        <label>Language</label>
        <select value={lang} onChange={e=>setLang(e.target.value)}>
          <option value="en">English (US)</option>
          <option value="de">German (DE)</option>
        </select>
      </div>

      <div className="form-row">
        <label>Seed</label>
        <input type="text" value={seed} onChange={e=>setSeed(e.target.value)} />
        <button onClick={()=>setSeed(String(Math.floor(Math.random()*1e12)))}>Random</button>
      </div>

      <div className="form-row">
        <label>Avg likes (0-10)</label>
        <input type="range" min={0} max={10} step={0.1} value={likes} onChange={e=>setLikes(Number(e.target.value))} />
        <span>{likes.toFixed(1)}</span>
      </div>
    </div>
  );
}
