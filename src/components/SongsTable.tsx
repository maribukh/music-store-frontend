
import React, { useState } from "react";

export default function SongsTable({ songs, page, setPage, totalPage }:
  { songs:any[]; page:number; setPage:(p:number)=>void; totalPage:number }) {

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="table-card">
      <div className="table-header">
        <div>Title</div>
        <div>Artist</div>
        <div>Album</div>
        <div>Genre</div>
        <div>Likes</div>
      </div>
      <div className="table-body">
        {songs.map(s => (
          <div key={s.index} className="table-row" onClick={()=>setExpanded(expanded===s.index?null:s.index)}>
            <div className="cell title">{s.title}</div>
            <div className="cell">{s.artist}</div>
            <div className="cell">{s.album}</div>
            <div className="cell">{s.genre}</div>
            <div className="cell">{s.likes}</div>
            {expanded===s.index && (
              <div className="expanded">
                <div className="cover">Cover (seed: {s.coverSeed})</div>
                <div className="review">{s.review}</div>
                <div><button onClick={(e)=>{e.stopPropagation(); alert('play preview (not implemented)')}}>Play</button></div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pagination">
        <button disabled={page<=1} onClick={()=>setPage(page-1)}>Prev</button>
        <span>Page {page}</span>
        <button onClick={()=>setPage(page+1)}>Next</button>
      </div>
    </div>
  );
}
