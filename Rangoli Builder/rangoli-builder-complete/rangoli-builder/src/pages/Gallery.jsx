// src/pages/Gallery.jsx
import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { ArrowLeft, Heart, Play } from "lucide-react";
import { FESTIVALS }           from "../data/festivals";
import { patternAPI }          from "../utils/apiClient";

export default function Gallery() {
  const navigate = useNavigate();
  const [filter,   setFilter]  = useState("all");
  const [patterns, setPatterns]= useState([]);
  const [loading,  setLoading] = useState(false);
  const [page,     setPage]    = useState(1);
  const [hasMore,  setHasMore] = useState(true);

  const load = async (reset = false) => {
    setLoading(true);
    try {
      const params = { page: reset ? 1 : page, limit: 16 };
      if (filter !== "all") params.festival = filter;
      const { data } = await patternAPI.list(params);
      setPatterns(prev => reset ? data.patterns : [...prev, ...data.patterns]);
      setHasMore(data.page < data.pages);
      if (!reset) setPage(p => p + 1);
    } catch { setPatterns([]); }
    setLoading(false);
  };

  useEffect(() => { setPage(1); load(true); }, [filter]);

  const handleLike = async (id, e) => {
    e.stopPropagation();
    try {
      await patternAPI.like(id);
      setPatterns(prev => prev.map(p => p._id === id ? { ...p, likes: (p.likes||0)+1 } : p));
    } catch { /* needs login */ }
  };

  return (
    <div className="min-h-screen" style={{background:"linear-gradient(135deg,#0F0A1E,#1a0a2e)"}}>
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/8">
        <button onClick={()=>navigate("/")} className="text-white/40 hover:text-white"><ArrowLeft size={18}/></button>
        <h1 className="text-lg font-bold text-white">Community Gallery</h1>
      </header>
      <div className="flex gap-2 px-6 py-4 overflow-x-auto">
        {[{id:"all",name:"All",emoji:"🎨"},...FESTIVALS].map(f=>(
          <button key={f.id} onClick={()=>setFilter(f.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all
              ${filter===f.id?"bg-saffron text-white":"bg-white/5 text-white/50 hover:text-white/80"}`}>
            {f.emoji} {f.name}
          </button>
        ))}
      </div>
      <div className="px-6 pb-16">
        {patterns.length===0 && !loading ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🎨</p>
            <p className="text-white/40 mb-2">No designs yet</p>
            <p className="text-white/25 text-sm">Connect the backend and save your first design!</p>
            <button onClick={()=>navigate("/game/free/diwali")}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-bold text-white bg-saffron hover:bg-saffron-dark transition-all">
              Free Build 🎨
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {patterns.map(p=>{
              const fest=FESTIVALS.find(f=>f.id===p.festival);
              return (
                <div key={p._id}
                  onClick={()=>navigate(`/game/puzzle/${p.festival}?patternId=${p._id}`)}
                  className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all cursor-pointer">
                  <div className="aspect-square flex items-center justify-center text-5xl"
                    style={{background:`linear-gradient(135deg,${fest?.glowColor||"rgba(232,93,4,0.1)"},transparent)`}}>
                    {fest?.emoji||"🎨"}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-white truncate">{p.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{p.authorId?.username||"Unknown"}</p>
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e)=>handleLike(p._id,e)}
                      className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-white/70 hover:text-red-400">
                      <Heart size={11}/><span>{p.likes||0}</span>
                    </button>
                    <div className="bg-saffron/80 rounded-lg px-2 py-1"><Play size={11} className="text-white"/></div>
                  </div>
                  {p.isOfficial&&<div className="absolute top-2 left-2 bg-yellow-500/80 rounded-lg px-2 py-0.5 text-xs font-bold text-white">★ Official</div>}
                </div>
              );
            })}
          </div>
        )}
        {loading&&<div className="text-center py-8 text-white/30 text-sm">Loading…</div>}
        {hasMore&&!loading&&patterns.length>0&&(
          <div className="text-center mt-8">
            <button onClick={()=>load(false)} className="px-8 py-3 rounded-xl text-sm text-white/60 border border-white/15 hover:border-white/30 hover:text-white transition-all">
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
