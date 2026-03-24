import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const TEAMS = [
  { name:"Argentina",      flag:"🇦🇷", fifaRank:2,  gdpPC:13650,  pop:46,   hdi:0.842, gini:41.4, wcWins:3, wcAppear:18, hostAdv:0, iffhs:1089,  sqVal:3040,  futPrimary:1, continent:"South America" },
  { name:"Francia",        flag:"🇫🇷", fifaRank:3,  gdpPC:44408,  pop:68,   hdi:0.903, gini:31.6, wcWins:2, wcAppear:16, hostAdv:0, iffhs:1502,  sqVal:4540,  futPrimary:1, continent:"Europe" },
  { name:"España",         flag:"🇪🇸", fifaRank:1,  gdpPC:32280,  pop:48,   hdi:0.905, gini:33.0, wcWins:1, wcAppear:16, hostAdv:0, iffhs:2073,  sqVal:4760,  futPrimary:1, continent:"Europe" },
  { name:"Brasil",         flag:"🇧🇷", fifaRank:4,  gdpPC:10412,  pop:216,  hdi:0.760, gini:48.9, wcWins:5, wcAppear:22, hostAdv:0, iffhs:1999,  sqVal:4990,  futPrimary:1, continent:"South America" },
  { name:"Inglaterra",     flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRank:5,  gdpPC:48913,  pop:56,   hdi:0.929, gini:35.1, wcWins:1, wcAppear:16, hostAdv:0, iffhs:2359,  sqVal:5150,  futPrimary:1, continent:"Europe" },
  { name:"Alemania",       flag:"🇩🇪", fifaRank:8,  gdpPC:51384,  pop:84,   hdi:0.942, gini:31.7, wcWins:4, wcAppear:20, hostAdv:0, iffhs:1880,  sqVal:3000,  futPrimary:1, continent:"Europe" },
  { name:"Portugal",       flag:"🇵🇹", fifaRank:6,  gdpPC:26780,  pop:10,   hdi:0.866, gini:33.8, wcWins:0, wcAppear:8,  hostAdv:0, iffhs:1145,  sqVal:1800,  futPrimary:1, continent:"Europe" },
  { name:"Países Bajos",   flag:"🇳🇱", fifaRank:7,  gdpPC:57025,  pop:18,   hdi:0.946, gini:28.1, wcWins:0, wcAppear:11, hostAdv:0, iffhs:1064,  sqVal:1350,  futPrimary:1, continent:"Europe" },
  { name:"Bélgica",        flag:"🇧🇪", fifaRank:9,  gdpPC:51767,  pop:12,   hdi:0.937, gini:27.2, wcWins:0, wcAppear:14, hostAdv:0, iffhs:957,   sqVal:1100,  futPrimary:1, continent:"Europe" },
  { name:"Italia",         flag:"🇮🇹", fifaRank:13, gdpPC:35657,  pop:59,   hdi:0.895, gini:32.8, wcWins:4, wcAppear:18, hostAdv:0, iffhs:1972,  sqVal:2830,  futPrimary:1, continent:"Europe" },
  { name:"Uruguay",        flag:"🇺🇾", fifaRank:17, gdpPC:21576,  pop:3.5,  hdi:0.830, gini:39.7, wcWins:2, wcAppear:14, hostAdv:0, iffhs:380,   sqVal:520,   futPrimary:1, continent:"South America" },
  { name:"Colombia",       flag:"🇨🇴", fifaRank:14, gdpPC:6630,   pop:52,   hdi:0.752, gini:51.3, wcWins:0, wcAppear:6,  hostAdv:0, iffhs:1025,  sqVal:460,   futPrimary:1, continent:"South America" },
  { name:"Croacia",        flag:"🇭🇷", fifaRank:10, gdpPC:20855,  pop:3.9,  hdi:0.878, gini:29.7, wcWins:0, wcAppear:6,  hostAdv:0, iffhs:380,   sqVal:420,   futPrimary:1, continent:"Europe" },
  { name:"EE.UU.",         flag:"🇺🇸", fifaRank:15, gdpPC:80035,  pop:334,  hdi:0.921, gini:39.8, wcWins:0, wcAppear:11, hostAdv:1, iffhs:400,   sqVal:962,   futPrimary:0, continent:"North America" },
  { name:"México",         flag:"🇲🇽", fifaRank:16, gdpPC:12673,  pop:130,  hdi:0.758, gini:45.4, wcWins:0, wcAppear:17, hostAdv:1, iffhs:420,   sqVal:310,   futPrimary:1, continent:"North America" },
  { name:"Canadá",         flag:"🇨🇦", fifaRank:29, gdpPC:52722,  pop:40,   hdi:0.935, gini:33.3, wcWins:0, wcAppear:2,  hostAdv:1, iffhs:200,   sqVal:280,   futPrimary:0, continent:"North America" },
  { name:"Japón",          flag:"🇯🇵", fifaRank:19, gdpPC:33815,  pop:125,  hdi:0.920, gini:32.9, wcWins:0, wcAppear:7,  hostAdv:0, iffhs:700,   sqVal:380,   futPrimary:0, continent:"Asia" },
  { name:"Marruecos",      flag:"🇲🇦", fifaRank:11, gdpPC:3981,   pop:38,   hdi:0.683, gini:39.5, wcWins:0, wcAppear:6,  hostAdv:0, iffhs:350,   sqVal:321,   futPrimary:1, continent:"Africa" },
  { name:"Senegal",        flag:"🇸🇳", fifaRank:12, gdpPC:1712,   pop:18,   hdi:0.511, gini:40.3, wcWins:0, wcAppear:3,  hostAdv:0, iffhs:280,   sqVal:264,   futPrimary:1, continent:"Africa" },
  { name:"Corea del Sur",  flag:"🇰🇷", fifaRank:22, gdpPC:32423,  pop:52,   hdi:0.929, gini:31.4, wcWins:0, wcAppear:11, hostAdv:0, iffhs:350,   sqVal:350,   futPrimary:0, continent:"Asia" },
  { name:"Nigeria",        flag:"🇳🇬", fifaRank:26, gdpPC:2184,   pop:224,  hdi:0.535, gini:35.1, wcWins:0, wcAppear:7,  hostAdv:0, iffhs:340,   sqVal:343,   futPrimary:1, continent:"Africa" },
  { name:"Ecuador",        flag:"🇪🇨", fifaRank:23, gdpPC:6320,   pop:18,   hdi:0.740, gini:45.0, wcWins:0, wcAppear:4,  hostAdv:0, iffhs:817,   sqVal:220,   futPrimary:1, continent:"South America" },
  { name:"Arabia Saudita", flag:"🇸🇦", fifaRank:56, gdpPC:32586,  pop:37,   hdi:0.875, gini:45.9, wcWins:0, wcAppear:6,  hostAdv:0, iffhs:868,   sqVal:85,    futPrimary:0, continent:"Asia" },
  { name:"Qatar",          flag:"🇶🇦", fifaRank:35, gdpPC:87662,  pop:2.9,  hdi:0.855, gini:41.1, wcWins:0, wcAppear:1,  hostAdv:0, iffhs:120,   sqVal:28,    futPrimary:0, continent:"Asia" },
];

const FACTORS = [
  { key:"fifaScore",   label:"Ranking FIFA",         icon:"🏅", desc:"Posición actual en el ranking FIFA", color:"#f59e0b" },
  { key:"gdpScore",    label:"PIB per Cápita",       icon:"💰", desc:"Riqueza económica promedio", color:"#22c55e" },
  { key:"popScore",    label:"Población",             icon:"👥", desc:"Tamaño del talent pool", color:"#3b82f6" },
  { key:"hdiScore",    label:"Desarrollo Humano",     icon:"📊", desc:"Salud, educación e ingreso (IDH)", color:"#8b5cf6" },
  { key:"histScore",   label:"Historial Mundialista", icon:"🏆", desc:"Títulos + participaciones previas", color:"#ef4444" },
  { key:"hostScore",   label:"Ventaja de Local",      icon:"🏠", desc:"¿Es anfitrión del torneo?", color:"#06b6d4" },
  { key:"iffhsScore",  label:"Liga Doméstica",        icon:"🏟️", desc:"Fortaleza de la liga (IFFHS 2025)", color:"#f97316" },
  { key:"sqValScore",  label:"Valor del Plantel",     icon:"💎", desc:"Valor de mercado (Transfermarkt)", color:"#a855f7" },
  { key:"futPrimScore",label:"Fútbol = Deporte #1",   icon:"❤️", desc:"Preferencia revelada por el fútbol", color:"#ec4899" },
];

const norm = (v, min, max) => Math.max(0, Math.min(1, (v - min) / (max - min || 1)));

function computeScores(teams, weights) {
  const mx = {
    rank: Math.max(...teams.map(t => t.fifaRank)),
    gdp:  Math.max(...teams.map(t => t.gdpPC)),
    pop:  Math.max(...teams.map(t => t.pop)),
    wins: Math.max(...teams.map(t => t.wcWins)),
    app:  Math.max(...teams.map(t => t.wcAppear)),
    iff:  Math.max(...teams.map(t => t.iffhs)),
    sqv:  Math.max(...teams.map(t => t.sqVal)),
  };
  return teams.map(t => {
    const s = {
      fifaScore:   norm(mx.rank - t.fifaRank, 0, mx.rank) * 100,
      gdpScore:    norm(t.gdpPC, 0, mx.gdp) * 100,
      popScore:    norm(Math.log(t.pop + 1), Math.log(2), Math.log(mx.pop + 1)) * 100,
      hdiScore:    norm(t.hdi, 0.4, 1) * 100,
      histScore:   norm(t.wcWins, 0, mx.wins) * 60 + norm(t.wcAppear, 0, mx.app) * 40,
      hostScore:   t.hostAdv * 100,
      iffhsScore:  norm(t.iffhs, 0, mx.iff) * 100,
      sqValScore:  norm(Math.sqrt(t.sqVal), 0, Math.sqrt(mx.sqv)) * 100,
      futPrimScore:t.futPrimary * 100,
    };
    const tw = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
    const composite = Object.keys(s).reduce((sum, k) => sum + s[k] * (weights[k] || 0), 0) / tw;
    return { ...t, ...s, composite: Math.round(composite * 10) / 10 };
  }).sort((a, b) => b.composite - a.composite);
}

function toProbs(scored) {
  const tot = scored.reduce((s, t) => s + Math.pow(t.composite, 2.5), 0) || 1;
  return scored.map(t => ({ ...t, prob: Math.round((Math.pow(t.composite, 2.5) / tot) * 1000) / 10 }));
}

function simulate(scored, noise) {
  const noisy = scored.map(t => {
    const u1 = Math.random(), u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1 || 1e-4)) * Math.cos(2 * Math.PI * u2);
    return { name: t.name, s: Math.max(0, t.composite + z * noise * t.composite * 0.01) };
  });
  noisy.sort((a, b) => b.s - a.s);
  return noisy[0].name;
}

const PRESETS = {
  balanced:  { fifaScore:25, histScore:15, iffhsScore:10, sqValScore:15, gdpScore:5, popScore:3, hdiScore:5, hostScore:8, futPrimScore:5 },
  economist: { fifaScore:5,  histScore:5,  iffhsScore:10, sqValScore:10, gdpScore:20, popScore:10, hdiScore:15, hostScore:5, futPrimScore:10 },
  purist:    { fifaScore:30, histScore:25, iffhsScore:15, sqValScore:20, gdpScore:0, popScore:0, hdiScore:0, hostScore:8, futPrimScore:0 },
  underdog:  { fifaScore:3,  histScore:3,  iffhsScore:5,  sqValScore:3,  gdpScore:5, popScore:15, hdiScore:5, hostScore:30, futPrimScore:5 },
};

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:"10px 14px", color:"#e2e8f0", fontSize:12, fontFamily:"'Outfit',sans-serif", lineHeight:1.6 }}>
      <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{d.flag} {d.name}</div>
      <div>Probabilidad: <span style={{ color:"#f59e0b", fontWeight:700 }}>{d.prob}%</span></div>
      <div>Puntaje: {d.composite}</div>
    </div>
  );
};

export default function PrediccionMundial() {
  const [weights, setWeights] = useState(PRESETS.balanced);
  const [activePreset, setActivePreset] = useState("balanced");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [noise, setNoise] = useState(30);
  const [simWinner, setSimWinner] = useState(null);
  const [simHistory, setSimHistory] = useState([]);

  const scored = useMemo(() => toProbs(computeScores(TEAMS, weights)), [weights]);
  const top10 = scored.slice(0, 10);
  const winner = scored[0];

  const radarData = selectedTeam
    ? FACTORS.map(f => ({ factor: f.icon, label: f.label, value: selectedTeam[f.key], fullMark: 100 }))
    : null;

  const handleWeight = (k, v) => {
    setWeights(p => ({ ...p, [k]: Number(v) }));
    setActivePreset(null);
  };

  const setPreset = (n) => { setWeights(PRESETS[n]); setActivePreset(n); };

  const runOne = useCallback(() => {
    const w = simulate(scored, noise);
    const team = TEAMS.find(t => t.name === w);
    setSimWinner(team);
    setSimHistory(prev => [w, ...prev].slice(0, 50));
  }, [scored, noise]);

  const freqs = useMemo(() => {
    const counts = {};
    simHistory.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => ({
      name, count, pct: Math.round(count / simHistory.length * 1000) / 10,
      flag: TEAMS.find(t => t.name === name)?.flag,
    }));
  }, [simHistory]);

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#020810 0%,#0a1628 40%,#0d1f3c 100%)", color:"#e2e8f0", fontFamily:"'Outfit',sans-serif", padding:"0 0 60px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{ padding:"40px 24px 28px", textAlign:"center", borderBottom:"1px solid rgba(245,158,11,0.1)", position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 0%,rgba(245,158,11,0.06) 0%,transparent 70%)" }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#f59e0b", letterSpacing:3, textTransform:"uppercase", marginBottom:8 }}>Modelo Predictivo</div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:38, margin:"0 0 8px", background:"linear-gradient(135deg,#f8fafc,#94a3b8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            ¿Quién gana el Mundial 2026?
          </h1>
          <p style={{ fontSize:14, color:"#64748b", maxWidth:520, margin:"0 auto", lineHeight:1.5 }}>
            Ajusta los pesos de 9 variables y simula torneos para ver cómo la suerte cambia al campeón.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:920, margin:"0 auto", padding:"0 20px" }}>

        {/* WINNER CARDS */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:14, margin:"24px 0" }}>
          <div style={{ flex:"1 1 260px", textAlign:"center", padding:"24px 20px", background:"linear-gradient(135deg,rgba(245,158,11,0.08),rgba(249,115,22,0.04))", borderRadius:16, border:"1px solid rgba(245,158,11,0.15)" }}>
            <div style={{ fontSize:11, color:"#f59e0b", fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>Predicción del modelo</div>
            <div style={{ fontSize:48 }}>{winner.flag}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900 }}>{winner.name}</div>
            <div style={{ fontSize:18, fontWeight:700, color:"#f59e0b" }}>{winner.prob}%</div>
          </div>
          {simWinner && (
            <div key={simHistory.length} style={{ flex:"1 1 260px", textAlign:"center", padding:"24px 20px", background:"linear-gradient(135deg,rgba(59,130,246,0.08),rgba(99,102,241,0.04))", borderRadius:16, border:"1px solid rgba(59,130,246,0.15)" }}>
              <div style={{ fontSize:11, color:"#60a5fa", fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:6 }}>🎲 Último torneo simulado</div>
              <div style={{ fontSize:48 }}>{simWinner.flag}</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900 }}>{simWinner.name}</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:4 }}>{simHistory.length} torneo{simHistory.length !== 1 ? "s" : ""} simulado{simHistory.length !== 1 ? "s" : ""}</div>
            </div>
          )}
        </div>

        {/* PRESETS */}
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#475569", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Escenarios</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {[
              { key:"balanced", label:"⚖️ Balanceado" },
              { key:"economist", label:"📈 Economista" },
              { key:"purist", label:"⚽ Purista" },
              { key:"underdog", label:"🐴 Cenicienta" },
            ].map(p => (
              <button key={p.key} onClick={() => setPreset(p.key)} style={{
                padding:"9px 16px", borderRadius:10,
                border: activePreset === p.key ? "2px solid #f59e0b" : "2px solid #1e293b",
                background: activePreset === p.key ? "rgba(245,158,11,0.1)" : "#0a1628",
                color: activePreset === p.key ? "#f59e0b" : "#94a3b8",
                fontWeight: activePreset === p.key ? 700 : 500,
                fontSize:13, cursor:"pointer", fontFamily:"'Outfit',sans-serif",
              }}>{p.label}</button>
            ))}
          </div>
        </div>

        {/* SLIDERS */}
        <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, border:"1px solid #1e293b", padding:"20px", marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#475569", letterSpacing:1.5, textTransform:"uppercase", marginBottom:14 }}>Pesos del modelo</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
            {FACTORS.map(f => (
              <div key={f.key}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:f.color }}>{f.icon} {f.label}</span>
                  <span style={{ fontSize:14, fontWeight:800, color:"#f8fafc", fontFamily:"'Barlow Condensed',sans-serif", background:"rgba(255,255,255,0.06)", padding:"2px 8px", borderRadius:6, minWidth:28, textAlign:"center" }}>{weights[f.key]}</span>
                </div>
                <input type="range" min="0" max="50" value={weights[f.key]} onChange={e => handleWeight(f.key, e.target.value)} style={{ width:"100%", accentColor:f.color, height:5 }} />
                <div style={{ fontSize:10, color:"#475569", marginTop:1 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SIMULATOR */}
        <div style={{ background:"linear-gradient(135deg,rgba(59,130,246,0.06),rgba(99,102,241,0.03))", borderRadius:14, border:"1px solid rgba(59,130,246,0.15)", padding:"20px", marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#60a5fa", letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>🎲 Término de error (ε)</div>
          <p style={{ fontSize:13, color:"#94a3b8", margin:"0 0 14px", lineHeight:1.5 }}>
            Ajusta la incertidumbre y presiona "Simular" varias veces. Con ε=0% siempre gana el favorito. Con ε alto, cualquiera puede dar la sorpresa.
          </p>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:13, fontWeight:600, color:"#60a5fa" }}>Incertidumbre (ε)</span>
              <span style={{ fontSize:14, fontWeight:800, fontFamily:"'Barlow Condensed',sans-serif", color:"#f8fafc" }}>{noise}%</span>
            </div>
            <input type="range" min="0" max="80" value={noise} onChange={e => setNoise(Number(e.target.value))} style={{ width:"100%", accentColor:"#60a5fa" }} />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#475569" }}>
              <span>Determinista (0%)</span>
              <span>Todo puede pasar (80%)</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={runOne} style={{
              flex:1, padding:"14px", borderRadius:12, border:"none",
              background:"linear-gradient(135deg,#3b82f6,#6366f1)",
              color:"#f8fafc", fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:20, fontWeight:900, letterSpacing:2, textTransform:"uppercase", cursor:"pointer",
            }}>▶ Simular torneo</button>
            {simHistory.length > 0 && (
              <button onClick={() => { setSimHistory([]); setSimWinner(null); }} style={{
                padding:"14px 18px", borderRadius:12, border:"1px solid #334155",
                background:"transparent", color:"#64748b", fontSize:13, cursor:"pointer",
              }}>🔄</button>
            )}
          </div>
          {freqs.length > 0 && (
            <div style={{ marginTop:14 }}>
              <div style={{ fontSize:11, color:"#475569", fontWeight:600, marginBottom:8 }}>Historial ({simHistory.length} simulaciones):</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {freqs.slice(0, 8).map(f => (
                  <div key={f.name} style={{ background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"6px 10px", fontSize:13, display:"flex", alignItems:"center", gap:5 }}>
                    <span>{f.flag}</span>
                    <span style={{ fontWeight:700, color:"#60a5fa" }}>{f.count}</span>
                    <span style={{ fontSize:11, color:"#475569" }}>({f.pct}%)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BAR CHART */}
        <div style={{ marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#475569", letterSpacing:1.5, textTransform:"uppercase", marginBottom:10 }}>Top 10 — Probabilidad (%)</div>
          <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, border:"1px solid #1e293b", padding:"20px 10px 10px 0" }}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={top10} layout="vertical" margin={{ top:0, right:20, bottom:0, left:10 }}>
                <XAxis type="number" domain={[0,"auto"]} tick={{ fill:"#475569", fontSize:11 }} axisLine={{ stroke:"#1e293b" }} />
                <YAxis type="category" dataKey="name" tick={(props) => {
                  const { x, y, payload } = props;
                  const team = top10.find(t => t.name === payload.value);
                  return <text x={x} y={y} dy={4} textAnchor="end" fill="#94a3b8" fontSize={12} fontFamily="Outfit">{team?.flag} {payload.value}</text>;
                }} width={130} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} cursor={{ fill:"rgba(255,255,255,0.03)" }} />
                <Bar dataKey="prob" radius={[0,6,6,0]} barSize={24}>
                  {top10.map((e, i) => (
                    <Cell key={e.name} fill={i === 0 ? "#f59e0b" : i < 3 ? "#d97706" : "#92400e"} fillOpacity={i === 0 ? 1 : 0.7 - i * 0.04} cursor="pointer" onClick={() => setSelectedTeam(e)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RADAR */}
        {selectedTeam && radarData && (
          <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:14, border:"1px solid #1e293b", padding:"20px", marginBottom:24 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <span style={{ fontSize:24 }}>{selectedTeam.flag}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, marginLeft:10 }}>{selectedTeam.name}</span>
                <span style={{ fontSize:14, color:"#f59e0b", fontWeight:700, marginLeft:10 }}>{selectedTeam.prob}%</span>
              </div>
              <button onClick={() => setSelectedTeam(null)} style={{ background:"none", border:"1px solid #334155", borderRadius:8, color:"#94a3b8", padding:"6px 12px", cursor:"pointer", fontSize:12 }}>✕</button>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:16, alignItems:"center", justifyContent:"center" }}>
              <ResponsiveContainer width={300} height={260}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill:"#94a3b8", fontSize:16 }} />
                  <PolarRadiusAxis angle={90} domain={[0,100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:13 }}>
                {FACTORS.map(f => (
                  <div key={f.key} style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span>{f.icon}</span>
                    <div>
                      <div style={{ color:"#64748b", fontSize:11 }}>{f.label}</div>
                      <div style={{ fontWeight:700, color:f.color }}>{Math.round(selectedTeam[f.key])}/100</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!selectedTeam && <div style={{ textAlign:"center", color:"#475569", fontSize:13, marginBottom:24, fontStyle:"italic" }}>👆 Clic en una barra para ver el perfil radar</div>}

        {/* CARDS */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:12, marginBottom:28 }}>
          <div style={{ flex:"1 1 260px", background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.15)", borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>🎲</div>
            <div style={{ fontWeight:700, fontSize:14, color:"#60a5fa", marginBottom:6 }}>El término de error (ε)</div>
            <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.5 }}>En una regresión, ε captura todo lo que no está en el modelo. Simula con ε=0 → siempre gana el mismo. Con ε=50 → empiezan las sorpresas. Así se ve la diferencia entre R²=1 y R²=0.3.</div>
          </div>
          <div style={{ flex:"1 1 260px", background:"rgba(245,158,11,0.06)", border:"1px solid rgba(245,158,11,0.15)", borderRadius:12, padding:"16px 18px" }}>
            <div style={{ fontSize:20, marginBottom:6 }}>⚠️</div>
            <div style={{ fontWeight:700, fontSize:14, color:"#fbbf24", marginBottom:6 }}>Limitaciones del modelo</div>
            <div style={{ fontSize:13, color:"#94a3b8", lineHeight:1.5 }}>Sorteo, lesiones, táctica, química del equipo — hay variables que no podemos cuantificar. Reconocer los límites es parte de pensar como economista.</div>
          </div>
        </div>

        <div style={{ textAlign:"center", fontSize:10, color:"#334155", borderTop:"1px solid #1e293b", padding:"20px 0 0" }}>
          Modelo educativo · FIFA (Ene 2026) · IFFHS (2025) · Transfermarkt (Nov 2025) · World Bank · UNDP · Tec de Monterrey
        </div>
      </div>
    </div>
  );
}
