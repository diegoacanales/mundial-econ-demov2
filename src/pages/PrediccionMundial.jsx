import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

const TEAMS = [
  { name: "Argentina",    flag: "🇦🇷", fifaRank: 2,  gdpPC: 13650,  pop: 46,  hdi: 0.842, gini: 41.4, wcWins: 3, wcAppear: 18, hostAdv: 0, confed: "CONMEBOL" },
  { name: "Francia",      flag: "🇫🇷", fifaRank: 3,  gdpPC: 44408,  pop: 68,  hdi: 0.903, gini: 31.6, wcWins: 2, wcAppear: 16, hostAdv: 0, confed: "UEFA" },
  { name: "España",       flag: "🇪🇸", fifaRank: 1,  gdpPC: 32280,  pop: 48,  hdi: 0.905, gini: 33.0, wcWins: 1, wcAppear: 16, hostAdv: 0, confed: "UEFA" },
  { name: "Brasil",       flag: "🇧🇷", fifaRank: 4,  gdpPC: 10412,  pop: 216, hdi: 0.760, gini: 48.9, wcWins: 5, wcAppear: 22, hostAdv: 0, confed: "CONMEBOL" },
  { name: "Inglaterra",   flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", fifaRank: 5,  gdpPC: 48913,  pop: 56,  hdi: 0.929, gini: 35.1, wcWins: 1, wcAppear: 16, hostAdv: 0, confed: "UEFA" },
  { name: "Alemania",     flag: "🇩🇪", fifaRank: 8,  gdpPC: 51384,  pop: 84,  hdi: 0.942, gini: 31.7, wcWins: 4, wcAppear: 20, hostAdv: 0, confed: "UEFA" },
  { name: "Portugal",     flag: "🇵🇹", fifaRank: 6,  gdpPC: 26780,  pop: 10,  hdi: 0.866, gini: 33.8, wcWins: 0, wcAppear: 8,  hostAdv: 0, confed: "UEFA" },
  { name: "Países Bajos", flag: "🇳🇱", fifaRank: 7,  gdpPC: 57025,  pop: 18,  hdi: 0.946, gini: 28.1, wcWins: 0, wcAppear: 11, hostAdv: 0, confed: "UEFA" },
  { name: "Bélgica",      flag: "🇧🇪", fifaRank: 9,  gdpPC: 51767,  pop: 12,  hdi: 0.937, gini: 27.2, wcWins: 0, wcAppear: 14, hostAdv: 0, confed: "UEFA" },
  { name: "Italia",       flag: "🇮🇹", fifaRank: 13, gdpPC: 35657,  pop: 59,  hdi: 0.895, gini: 32.8, wcWins: 4, wcAppear: 18, hostAdv: 0, confed: "UEFA" },
  { name: "Uruguay",      flag: "🇺🇾", fifaRank: 17, gdpPC: 21576,  pop: 3.5, hdi: 0.830, gini: 39.7, wcWins: 2, wcAppear: 14, hostAdv: 0, confed: "CONMEBOL" },
  { name: "Colombia",     flag: "🇨🇴", fifaRank: 14, gdpPC: 6630,   pop: 52,  hdi: 0.752, gini: 51.3, wcWins: 0, wcAppear: 6,  hostAdv: 0, confed: "CONMEBOL" },
  { name: "Croacia",      flag: "🇭🇷", fifaRank: 10, gdpPC: 20855,  pop: 3.9, hdi: 0.878, gini: 29.7, wcWins: 0, wcAppear: 6,  hostAdv: 0, confed: "UEFA" },
  { name: "EE.UU.",       flag: "🇺🇸", fifaRank: 15, gdpPC: 80035,  pop: 334, hdi: 0.921, gini: 39.8, wcWins: 0, wcAppear: 11, hostAdv: 1, confed: "CONCACAF" },
  { name: "México",       flag: "🇲🇽", fifaRank: 16, gdpPC: 12673,  pop: 130, hdi: 0.758, gini: 45.4, wcWins: 0, wcAppear: 17, hostAdv: 1, confed: "CONCACAF" },
  { name: "Canadá",       flag: "🇨🇦", fifaRank: 29, gdpPC: 52722,  pop: 40,  hdi: 0.935, gini: 33.3, wcWins: 0, wcAppear: 2,  hostAdv: 1, confed: "CONCACAF" },
  { name: "Japón",        flag: "🇯🇵", fifaRank: 19, gdpPC: 33815,  pop: 125, hdi: 0.920, gini: 32.9, wcWins: 0, wcAppear: 7,  hostAdv: 0, confed: "AFC" },
  { name: "Marruecos",    flag: "🇲🇦", fifaRank: 11, gdpPC: 3981,   pop: 38,  hdi: 0.683, gini: 39.5, wcWins: 0, wcAppear: 6,  hostAdv: 0, confed: "CAF" },
  { name: "Senegal",      flag: "🇸🇳", fifaRank: 12, gdpPC: 1712,   pop: 18,  hdi: 0.511, gini: 40.3, wcWins: 0, wcAppear: 3,  hostAdv: 0, confed: "CAF" },
  { name: "Corea del Sur", flag: "🇰🇷", fifaRank: 22, gdpPC: 32423, pop: 52,  hdi: 0.929, gini: 31.4, wcWins: 0, wcAppear: 11, hostAdv: 0, confed: "AFC" },
  { name: "Nigeria",      flag: "🇳🇬", fifaRank: 26, gdpPC: 2184,   pop: 224, hdi: 0.535, gini: 35.1, wcWins: 0, wcAppear: 7,  hostAdv: 0, confed: "CAF" },
  { name: "Ecuador",      flag: "🇪🇨", fifaRank: 23, gdpPC: 6320,   pop: 18,  hdi: 0.740, gini: 45.0, wcWins: 0, wcAppear: 4,  hostAdv: 0, confed: "CONMEBOL" },
  { name: "Arabia Saudita", flag: "🇸🇦", fifaRank: 56, gdpPC: 32586, pop: 37, hdi: 0.875, gini: 45.9, wcWins: 0, wcAppear: 6,  hostAdv: 0, confed: "AFC" },
  { name: "Qatar",        flag: "🇶🇦", fifaRank: 35, gdpPC: 87662,  pop: 2.9, hdi: 0.855, gini: 41.1, wcWins: 0, wcAppear: 1,  hostAdv: 0, confed: "AFC" },
];

const FACTORS = [
  { key: "fifaScore",  label: "Ranking FIFA",     icon: "🏅", desc: "Posición actual en el ranking mundial FIFA (invertido: mejor rank = más puntos)", color: "#f59e0b" },
  { key: "gdpScore",   label: "PIB per Cápita",   icon: "💰", desc: "Riqueza económica promedio — ¿más dinero = mejor fútbol?", color: "#22c55e" },
  { key: "popScore",   label: "Población",         icon: "👥", desc: "Más habitantes = más talento del cual escoger", color: "#3b82f6" },
  { key: "hdiScore",   label: "Desarrollo Humano", icon: "📊", desc: "Índice que combina salud, educación e ingreso", color: "#8b5cf6" },
  { key: "histScore",  label: "Historial Mundialista", icon: "🏆", desc: "Mundiales ganados y participaciones previas", color: "#ef4444" },
  { key: "hostScore",  label: "Ventaja de Local",  icon: "🏟️", desc: "Ser anfitrión históricamente aumenta probabilidades de avanzar", color: "#06b6d4" },
];

const normalize = (val, min, max) => Math.max(0, Math.min(1, (val - min) / (max - min || 1)));

function computeScores(teams, weights) {
  const maxRank = Math.max(...teams.map(t => t.fifaRank));
  const maxGDP = Math.max(...teams.map(t => t.gdpPC));
  const maxPop = Math.max(...teams.map(t => t.pop));
  const maxWins = Math.max(...teams.map(t => t.wcWins));
  const maxAppear = Math.max(...teams.map(t => t.wcAppear));

  return teams.map(t => {
    const fifaScore = normalize(maxRank - t.fifaRank, 0, maxRank) * 100;
    const gdpScore = normalize(t.gdpPC, 0, maxGDP) * 100;
    const popScore = normalize(Math.log(t.pop + 1), Math.log(2), Math.log(maxPop + 1)) * 100;
    const hdiScore = normalize(t.hdi, 0.4, 1) * 100;
    const histScore = (normalize(t.wcWins, 0, maxWins) * 60 + normalize(t.wcAppear, 0, maxAppear) * 40);
    const hostScore = t.hostAdv * 100;

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
    const composite =
      (fifaScore * weights.fifaScore +
       gdpScore * weights.gdpScore +
       popScore * weights.popScore +
       hdiScore * weights.hdiScore +
       histScore * weights.histScore +
       hostScore * weights.hostScore) / totalWeight;

    return {
      ...t,
      fifaScore: Math.round(fifaScore),
      gdpScore: Math.round(gdpScore),
      popScore: Math.round(popScore),
      hdiScore: Math.round(hdiScore),
      histScore: Math.round(histScore),
      hostScore: Math.round(hostScore),
      composite: Math.round(composite * 10) / 10,
    };
  }).sort((a, b) => b.composite - a.composite);
}

function toProbabilities(scored) {
  const total = scored.reduce((s, t) => s + Math.pow(t.composite, 2.5), 0);
  return scored.map(t => ({
    ...t,
    prob: Math.round((Math.pow(t.composite, 2.5) / total) * 1000) / 10,
  }));
}

const PRESETS = {
  balanced: { fifaScore: 35, gdpScore: 10, popScore: 5, hdiScore: 10, histScore: 30, hostScore: 10 },
  economist: { fifaScore: 10, gdpScore: 30, popScore: 15, hdiScore: 25, histScore: 10, hostScore: 10 },
  purist: { fifaScore: 50, gdpScore: 0, popScore: 0, hdiScore: 0, histScore: 40, hostScore: 10 },
  underdog: { fifaScore: 5, gdpScore: 5, popScore: 25, hdiScore: 15, histScore: 5, hostScore: 45 },
};

const TooltipCustom = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 12, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{d.flag} {d.name}</div>
      <div>Probabilidad: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{d.prob}%</span></div>
      <div>Puntaje compuesto: <span style={{ fontWeight: 600 }}>{d.composite}</span></div>
      <div style={{ marginTop: 4, borderTop: "1px solid #1e3a5f", paddingTop: 4, color: "#94a3b8" }}>
        🏅 FIFA: {d.fifaScore} · 💰 PIB: {d.gdpScore} · 👥 Pob: {d.popScore}
        <br/>📊 IDH: {d.hdiScore} · 🏆 Hist: {d.histScore} · 🏟️ Local: {d.hostScore}
      </div>
    </div>
  );
};

export default function PrediccionMundial() {
  const [weights, setWeights] = useState(PRESETS.balanced);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activePreset, setActivePreset] = useState("balanced");

  const scored = useMemo(() => toProbabilities(computeScores(TEAMS, weights)), [weights]);
  const top10 = scored.slice(0, 10);
  const winner = scored[0];

  const radarData = selectedTeam
    ? FACTORS.map(f => ({
        factor: f.icon,
        label: f.label,
        value: selectedTeam[f.key],
        fullMark: 100,
      }))
    : null;

  const handleWeight = (key, val) => {
    setWeights(prev => ({ ...prev, [key]: Number(val) }));
    setActivePreset(null);
  };

  const setPreset = (name) => {
    setWeights(PRESETS[name]);
    setActivePreset(name);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #020810 0%, #0a1628 40%, #0d1f3c 100%)",
      color: "#e2e8f0",
      fontFamily: "'Outfit', sans-serif",
      padding: "0 0 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{
        padding: "40px 24px 32px",
        textAlign: "center",
        position: "relative",
        borderBottom: "1px solid rgba(245,158,11,0.1)",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Modelo Predictivo</div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 38,
            margin: "0 0 8px",
            letterSpacing: "1px",
            background: "linear-gradient(135deg, #f8fafc, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            ¿Quién gana el Mundial 2026?
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", maxWidth: 520, margin: "0 auto", lineHeight: 1.5 }}>
            Ajusta los pesos de cada variable económica y deportiva para construir tu propio modelo. ¿Qué pesa más: el dinero, el talento, o la historia?
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 20px" }}>

        {/* WINNER DISPLAY */}
        <div style={{
          textAlign: "center",
          padding: "28px 20px",
          margin: "24px 0",
          background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(249,115,22,0.04))",
          borderRadius: 16,
          border: "1px solid rgba(245,158,11,0.15)",
        }}>
          <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Predicción del modelo</div>
          <div style={{ fontSize: 56, marginBottom: 4 }}>{winner.flag}</div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 32,
            fontWeight: 900,
            color: "#f8fafc",
            letterSpacing: "1px",
          }}>{winner.name}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b", marginTop: 4 }}>{winner.prob}% probabilidad</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Puntaje compuesto: {winner.composite}/100</div>
        </div>

        {/* PRESETS */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Escenarios predefinidos</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { key: "balanced", label: "⚖️ Balanceado", desc: "Todos los factores" },
              { key: "economist", label: "📈 Economista", desc: "PIB + IDH dominan" },
              { key: "purist", label: "⚽ Purista", desc: "Solo fútbol + historial" },
              { key: "underdog", label: "🐴 Cenicienta", desc: "Población + local" },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: activePreset === p.key ? "2px solid #f59e0b" : "2px solid #1e293b",
                  background: activePreset === p.key ? "rgba(245,158,11,0.1)" : "#0a1628",
                  color: activePreset === p.key ? "#f59e0b" : "#94a3b8",
                  fontWeight: activePreset === p.key ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* WEIGHT SLIDERS */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: 14,
          border: "1px solid #1e293b",
          padding: "20px",
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16 }}>
            Ajusta los pesos del modelo
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {FACTORS.map(f => (
              <div key={f.key}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: f.color }}>
                    {f.icon} {f.label}
                  </span>
                  <span style={{
                    fontSize: 14, fontWeight: 800, color: "#f8fafc",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    background: "rgba(255,255,255,0.06)",
                    padding: "2px 8px",
                    borderRadius: 6,
                    minWidth: 32,
                    textAlign: "center",
                  }}>{weights[f.key]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={weights[f.key]}
                  onChange={e => handleWeight(f.key, e.target.value)}
                  style={{
                    width: "100%",
                    accentColor: f.color,
                    height: 6,
                  }}
                />
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP 10 BAR CHART */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
            Top 10 — Probabilidad de ganar (%)
          </div>
          <div style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 14,
            border: "1px solid #1e293b",
            padding: "20px 10px 10px 0",
          }}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                <XAxis type="number" domain={[0, "auto"]} tick={{ fill: "#475569", fontSize: 11 }} axisLine={{ stroke: "#1e293b" }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={(props) => {
                    const { x, y, payload } = props;
                    const team = top10.find(t => t.name === payload.value);
                    return (
                      <text x={x} y={y} dy={4} textAnchor="end" fill="#94a3b8" fontSize={12} fontFamily="Outfit">
                        {team?.flag} {payload.value}
                      </text>
                    );
                  }}
                  width={130}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<TooltipCustom />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="prob" radius={[0, 6, 6, 0]} barSize={24}>
                  {top10.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={i === 0 ? "#f59e0b" : i < 3 ? "#d97706" : "#92400e"}
                      fillOpacity={i === 0 ? 1 : 0.7 - i * 0.04}
                      cursor="pointer"
                      onClick={() => setSelectedTeam(entry)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RADAR CHART FOR SELECTED TEAM */}
        {selectedTeam && radarData && (
          <div style={{
            background: "rgba(255,255,255,0.02)",
            borderRadius: 14,
            border: "1px solid #1e293b",
            padding: "20px",
            marginBottom: 28,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 24 }}>{selectedTeam.flag}</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, marginLeft: 10, color: "#f8fafc" }}>{selectedTeam.name}</span>
                <span style={{ fontSize: 14, color: "#f59e0b", fontWeight: 700, marginLeft: 10 }}>{selectedTeam.prob}%</span>
              </div>
              <button onClick={() => setSelectedTeam(null)} style={{ background: "none", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", padding: "6px 12px", cursor: "pointer", fontSize: 12 }}>✕ Cerrar</button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "center" }}>
              <ResponsiveContainer width={300} height={250}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="factor" tick={{ fill: "#94a3b8", fontSize: 16 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="value" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                {FACTORS.map(f => (
                  <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{f.icon}</span>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: 11 }}>{f.label}</div>
                      <div style={{ fontWeight: 700, color: f.color }}>{selectedTeam[f.key]}/100</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!selectedTeam && (
          <div style={{ textAlign: "center", color: "#475569", fontSize: 13, marginBottom: 28, fontStyle: "italic" }}>
            👆 Haz clic en una barra del gráfico para ver el perfil detallado de un equipo
          </div>
        )}

        {/* FULL TABLE */}
        <details style={{ marginBottom: 24 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#64748b", padding: "10px 0", borderBottom: "1px solid #1e293b", userSelect: "none", letterSpacing: 0.5 }}>
            📋 Tabla completa — {TEAMS.length} equipos
          </summary>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #1e3a5f" }}>
                  {["#", "", "Equipo", "Prob%", "Score", "FIFA", "PIB", "Pob", "IDH", "Hist", "Local"].map(h => (
                    <th key={h} style={{ padding: "8px 8px", textAlign: "left", color: "#475569", fontWeight: 700, whiteSpace: "nowrap", fontSize: 11 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scored.map((t, i) => (
                  <tr
                    key={t.name}
                    onClick={() => setSelectedTeam(t)}
                    style={{
                      borderBottom: "1px solid #1e293b",
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "6px 8px", fontWeight: 700, color: i < 3 ? "#f59e0b" : "#64748b" }}>{i + 1}</td>
                    <td style={{ padding: "6px 4px", fontSize: 18 }}>{t.flag}</td>
                    <td style={{ padding: "6px 8px", fontWeight: 600, color: "#e2e8f0" }}>{t.name}</td>
                    <td style={{ padding: "6px 8px", fontWeight: 800, color: "#f59e0b" }}>{t.prob}%</td>
                    <td style={{ padding: "6px 8px", fontWeight: 600, color: "#94a3b8" }}>{t.composite}</td>
                    <td style={{ padding: "6px 8px", color: "#f59e0b" }}>{t.fifaScore}</td>
                    <td style={{ padding: "6px 8px", color: "#22c55e" }}>{t.gdpScore}</td>
                    <td style={{ padding: "6px 8px", color: "#3b82f6" }}>{t.popScore}</td>
                    <td style={{ padding: "6px 8px", color: "#8b5cf6" }}>{t.hdiScore}</td>
                    <td style={{ padding: "6px 8px", color: "#ef4444" }}>{t.histScore}</td>
                    <td style={{ padding: "6px 8px", color: "#06b6d4" }}>{t.hostScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* PEDAGOGICAL NOTE */}
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 28,
        }}>
          <div style={{ flex: "1 1 260px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🎯</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#fbbf24", marginBottom: 6 }}>¿Qué es un modelo?</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>Un modelo simplifica la realidad usando variables y pesos. Cambia los sliders y observa cómo las predicciones se transforman — así trabajan los economistas.</div>
          </div>
          <div style={{ flex: "1 1 260px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#60a5fa", marginBottom: 6 }}>Limitaciones</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>Ningún modelo captura todo. Lesiones, sorteo, estado de forma, táctica del entrenador — hay variables que no podemos cuantificar. Eso es parte de la economía: reconocer los límites.</div>
          </div>
          <div style={{ flex: "1 1 260px", background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🧪</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#a78bfa", marginBottom: 6 }}>Experimenta</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>¿Qué pasa si pones PIB al máximo? ¿Qatar o Noruega ganan el mundial? El modelo te dice que no — por algo los economistas usan múltiples variables.</div>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: 10, color: "#334155", borderTop: "1px solid #1e293b", padding: "20px 0 0" }}>
          Modelo educativo · Rankings FIFA (ene 2026) · Banco Mundial · PNUD · Tec de Monterrey
        </div>
      </div>
    </div>
  );
}
