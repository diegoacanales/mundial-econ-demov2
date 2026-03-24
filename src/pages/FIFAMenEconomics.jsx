import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const COUNTRIES = [
  { name: "Brazil", flag: "🇧🇷", continent: "South America", fifaRank: 1, gdpPC: 10412, pop: 216, hdi: 0.760, gini: 48.9, lifeExp: 76 },
  { name: "Argentina", flag: "🇦🇷", continent: "South America", fifaRank: 2, gdpPC: 13650, pop: 46, hdi: 0.842, gini: 41.4, lifeExp: 77 },
  { name: "France", flag: "🇫🇷", continent: "Europe", fifaRank: 3, gdpPC: 44408, pop: 68, hdi: 0.903, gini: 31.6, lifeExp: 83 },
  { name: "Spain", flag: "🇪🇸", continent: "Europe", fifaRank: 4, gdpPC: 32280, pop: 48, hdi: 0.905, gini: 33.0, lifeExp: 84 },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent: "Europe", fifaRank: 5, gdpPC: 48913, pop: 56, hdi: 0.929, gini: 35.1, lifeExp: 81 },
  { name: "Belgium", flag: "🇧🇪", continent: "Europe", fifaRank: 6, gdpPC: 51767, pop: 12, hdi: 0.937, gini: 27.2, lifeExp: 82 },
  { name: "Netherlands", flag: "🇳🇱", continent: "Europe", fifaRank: 7, gdpPC: 57025, pop: 18, hdi: 0.946, gini: 28.1, lifeExp: 82 },
  { name: "Portugal", flag: "🇵🇹", continent: "Europe", fifaRank: 8, gdpPC: 26780, pop: 10, hdi: 0.866, gini: 33.8, lifeExp: 82 },
  { name: "Colombia", flag: "🇨🇴", continent: "South America", fifaRank: 9, gdpPC: 6630, pop: 52, hdi: 0.752, gini: 51.3, lifeExp: 77 },
  { name: "Italy", flag: "🇮🇹", continent: "Europe", fifaRank: 10, gdpPC: 35657, pop: 59, hdi: 0.895, gini: 32.8, lifeExp: 84 },
  { name: "Germany", flag: "🇩🇪", continent: "Europe", fifaRank: 11, gdpPC: 51384, pop: 84, hdi: 0.942, gini: 31.7, lifeExp: 81 },
  { name: "Uruguay", flag: "🇺🇾", continent: "South America", fifaRank: 12, gdpPC: 21576, pop: 3.5, hdi: 0.830, gini: 39.7, lifeExp: 78 },
  { name: "Japan", flag: "🇯🇵", continent: "Asia", fifaRank: 15, gdpPC: 33815, pop: 125, hdi: 0.920, gini: 32.9, lifeExp: 85 },
  { name: "USA", flag: "🇺🇸", continent: "North America", fifaRank: 16, gdpPC: 80035, pop: 334, hdi: 0.921, gini: 39.8, lifeExp: 77 },
  { name: "Mexico", flag: "🇲🇽", continent: "North America", fifaRank: 17, gdpPC: 12673, pop: 130, hdi: 0.758, gini: 45.4, lifeExp: 75 },
  { name: "Senegal", flag: "🇸🇳", continent: "Africa", fifaRank: 20, gdpPC: 1712, pop: 18, hdi: 0.511, gini: 40.3, lifeExp: 68 },
  { name: "South Korea", flag: "🇰🇷", continent: "Asia", fifaRank: 22, gdpPC: 32423, pop: 52, hdi: 0.929, gini: 31.4, lifeExp: 84 },
  { name: "Nigeria", flag: "🇳🇬", continent: "Africa", fifaRank: 28, gdpPC: 2184, pop: 224, hdi: 0.535, gini: 35.1, lifeExp: 53 },
  { name: "Australia", flag: "🇦🇺", continent: "Oceania", fifaRank: 24, gdpPC: 65100, pop: 26, hdi: 0.946, gini: 34.3, lifeExp: 84 },
  { name: "Qatar", flag: "🇶🇦", continent: "Asia", fifaRank: 35, gdpPC: 87662, pop: 2.9, hdi: 0.855, gini: 41.1, lifeExp: 80 },
  { name: "Saudi Arabia", flag: "🇸🇦", continent: "Asia", fifaRank: 56, gdpPC: 32586, pop: 37, hdi: 0.875, gini: 45.9, lifeExp: 78 },
  { name: "India", flag: "🇮🇳", continent: "Asia", fifaRank: 126, gdpPC: 2612, pop: 1428, hdi: 0.644, gini: 35.2, lifeExp: 68 },
  { name: "China", flag: "🇨🇳", continent: "Asia", fifaRank: 88, gdpPC: 12720, pop: 1412, hdi: 0.788, gini: 38.2, lifeExp: 78 },
  { name: "Ghana", flag: "🇬🇭", continent: "Africa", fifaRank: 60, gdpPC: 2363, pop: 34, hdi: 0.602, gini: 43.5, lifeExp: 64 },
  { name: "Costa Rica", flag: "🇨🇷", continent: "North America", fifaRank: 48, gdpPC: 13280, pop: 5.2, hdi: 0.806, gini: 48.2, lifeExp: 80 },
  { name: "Norway", flag: "🇳🇴", continent: "Europe", fifaRank: 44, gdpPC: 87925, pop: 5.5, hdi: 0.961, gini: 27.6, lifeExp: 83 },
  { name: "Luxembourg", flag: "🇱🇺", continent: "Europe", fifaRank: 83, gdpPC: 126426, pop: 0.66, hdi: 0.927, gini: 35.4, lifeExp: 83 },
];

const VARIABLES = [
  { key: "gdpPC", label: "GDP per Capita", unit: "USD", desc: "The average economic output per person — a measure of how wealthy a country is on average.", color: "#22c55e" },
  { key: "pop", label: "Population", unit: "millions", desc: "Total number of people living in the country — does having more people mean more talent to choose from?", color: "#f59e0b" },
  { key: "hdi", label: "Human Development Index", unit: "(0–1)", desc: "A composite measure of health, education, and income — captures quality of life beyond just money.", color: "#8b5cf6" },
  { key: "gini", label: "Gini Coefficient", unit: "(0–100)", desc: "Measures income inequality — 0 means perfect equality, 100 means one person has everything.", color: "#ef4444" },
  { key: "lifeExp", label: "Life Expectancy", unit: "years", desc: "Average number of years a person is expected to live — reflects healthcare, nutrition, and living conditions.", color: "#06b6d4" },
];

const CONTINENT_COLORS = {
  "Europe": "#60a5fa",
  "South America": "#34d399",
  "North America": "#f97316",
  "Asia": "#facc15",
  "Africa": "#c084fc",
  "Oceania": "#fb7185",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#1a1a2e", border: "1px solid #334155", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{d.flag} {d.name}</div>
      <div style={{ color: "#94a3b8" }}>FIFA Rank: <span style={{ color: "#4ade80", fontWeight: 600 }}>#{d.fifaRank}</span></div>
      <div style={{ color: "#94a3b8" }}>GDP/cap: <span style={{ color: "#e2e8f0" }}>${d.gdpPC.toLocaleString()}</span></div>
      <div style={{ color: "#94a3b8" }}>Pop: <span style={{ color: "#e2e8f0" }}>{d.pop}M</span></div>
      <div style={{ color: "#94a3b8" }}>HDI: <span style={{ color: "#e2e8f0" }}>{d.hdi}</span></div>
      <div style={{ color: "#94a3b8" }}>Gini: <span style={{ color: "#e2e8f0" }}>{d.gini}</span></div>
    </div>
  );
};

const InsightCard = ({ emoji, title, text }) => (
  <div style={{
    background: "linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: "16px 18px",
    flex: "1 1 280px",
  }}>
    <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>{text}</div>
  </div>
);

export default function FIFAEconomics() {
  const [selectedVar, setSelectedVar] = useState("gdpPC");
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

  const variable = VARIABLES.find(v => v.key === selectedVar);

  const chartData = useMemo(() =>
    COUNTRIES.map(c => ({
      ...c,
      x: c[selectedVar],
      y: c.fifaRank,
    })),
    [selectedVar]
  );

  const correlation = useMemo(() => {
    const n = chartData.length;
    const xs = chartData.map(d => d.x);
    const ys = chartData.map(d => d.y);
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
    const dx = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0));
    const dy = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0));
    return (num / (dx * dy)).toFixed(3);
  }, [chartData]);

  const corrColor = Math.abs(correlation) > 0.4 ? (correlation < 0 ? "#4ade80" : "#f87171") : "#fbbf24";
  const corrLabel = Math.abs(correlation) < 0.2 ? "Very Weak" : Math.abs(correlation) < 0.4 ? "Weak" : Math.abs(correlation) < 0.6 ? "Moderate" : "Strong";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0f1e 0%, #0f172a 40%, #1a1a2e 100%)",
      color: "#e2e8f0",
      fontFamily: "'DM Sans', sans-serif",
      padding: "0 0 60px 0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Anybody:wght@800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "48px 32px 36px",
        borderBottom: "1px solid rgba(74,222,128,0.15)",
      }}>
        {/* Faint pitch lines */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(90deg, #4ade80 0px, #4ade80 2px, transparent 2px, transparent 80px)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <span style={{ fontSize: 36 }}>⚽</span>
            <span style={{
              fontFamily: "'Anybody', sans-serif",
              fontWeight: 900,
              fontSize: 32,
              background: "linear-gradient(135deg, #4ade80, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}>
              ECONOMICS × FIFA
            </span>
          </div>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
            Can money buy goals? Explore how a country's economy relates to its football ranking. Pick a variable, spot the patterns, and think like an economist.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* VARIABLE SELECTOR */}
        <div style={{ margin: "32px 0 8px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b", marginBottom: 12 }}>Choose a macroeconomic variable</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {VARIABLES.map(v => (
              <button
                key={v.key}
                onClick={() => setSelectedVar(v.key)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: selectedVar === v.key ? `2px solid ${v.color}` : "2px solid #1e293b",
                  background: selectedVar === v.key ? `${v.color}18` : "#0f172a",
                  color: selectedVar === v.key ? v.color : "#94a3b8",
                  fontWeight: selectedVar === v.key ? 700 : 500,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* VARIABLE DESCRIPTION */}
        <div style={{
          background: `${variable.color}10`,
          border: `1px solid ${variable.color}30`,
          borderRadius: 10,
          padding: "12px 18px",
          margin: "16px 0 24px",
          fontSize: 14,
          color: "#cbd5e1",
          lineHeight: 1.5,
        }}>
          <strong style={{ color: variable.color }}>{variable.label}</strong> ({variable.unit}): {variable.desc}
        </div>

        {/* CORRELATION BADGE */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "8px 16px",
          }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Correlation:</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: corrColor, fontFamily: "'Anybody', sans-serif" }}>{correlation}</span>
            <span style={{ fontSize: 11, color: corrColor, fontWeight: 600, textTransform: "uppercase" }}>{corrLabel}</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#94a3b8" }}>
            <input type="checkbox" checked={showLabels} onChange={() => setShowLabels(!showLabels)} style={{ accentColor: variable.color }} />
            Show country labels
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginLeft: "auto" }}>
            {Object.entries(CONTINENT_COLORS).map(([c, col]) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, display: "inline-block" }} />{c}
              </span>
            ))}
          </div>
        </div>

        {/* TIP */}
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8, fontStyle: "italic" }}>
          ↑ Lower rank = better team. Hover over dots for details.
        </div>

        {/* CHART */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1a1a2e)",
          border: "1px solid #1e293b",
          borderRadius: 16,
          padding: "24px 12px 12px 0",
          marginBottom: 32,
        }}>
          <ResponsiveContainer width="100%" height={420}>
            <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="#1e293b" />
              <XAxis
                dataKey="x"
                type="number"
                name={variable.label}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
                label={{ value: `${variable.label} (${variable.unit})`, position: "bottom", offset: 10, fill: "#94a3b8", fontSize: 13 }}
                domain={selectedVar === "hdi" ? [0.4, 1] : undefined}
              />
              <YAxis
                dataKey="y"
                type="number"
                name="FIFA Rank"
                reversed
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#334155" }}
                tickLine={{ stroke: "#334155" }}
                label={{ value: "FIFA Ranking ←  Better", angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 13 }}
                domain={[0, 140]}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              {Object.entries(CONTINENT_COLORS).map(([continent, color]) => (
                <Scatter
                  key={continent}
                  data={chartData.filter(d => d.continent === continent)}
                  fill={color}
                  fillOpacity={0.85}
                  strokeWidth={0}
                  shape={(props) => {
                    const { cx, cy, payload } = props;
                    const r = 7;
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.8} stroke={color} strokeWidth={1.5} strokeOpacity={0.4} />
                        {showLabels && (
                          <text x={cx + 10} y={cy + 4} fill="#94a3b8" fontSize={10} fontFamily="DM Sans">
                            {payload.flag} {payload.name}
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* DISCUSSION QUESTIONS */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: "'Anybody', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: "#4ade80",
            marginBottom: 16,
            letterSpacing: "-0.3px"
          }}>
            🧠 Think Like an Economist
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <InsightCard
              emoji="💡"
              title="Correlation ≠ Causation"
              text="Even if richer countries rank higher, does money cause better football? Or do other factors (sports culture, investment in youth academies, climate) matter more?"
            />
            <InsightCard
              emoji="🔍"
              title="Outliers Tell Stories"
              text="Why does Uruguay (pop. 3.5M) outperform China (1.4B) and India (1.4B)? Why does Qatar rank lower than Senegal despite being 50x richer per capita?"
            />
            <InsightCard
              emoji="📊"
              title="Which Variable Wins?"
              text="Toggle between variables. Which one best predicts FIFA rank? Is it wealth, population, equality, or human development? What does that tell us about sports success?"
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <details style={{ marginBottom: 24 }}>
          <summary style={{
            cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#94a3b8", padding: "10px 0",
            borderBottom: "1px solid #1e293b", userSelect: "none",
          }}>
            📋 View all country data ({COUNTRIES.length} countries)
          </summary>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #334155" }}>
                  {["", "Country", "FIFA", "GDP/cap", "Pop (M)", "HDI", "Gini", "Life Exp"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...COUNTRIES].sort((a, b) => a.fifaRank - b.fifaRank).map((c, i) => (
                  <tr key={c.name} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "rgba(30,41,59,0.3)" }}>
                    <td style={{ padding: "6px 10px", fontSize: 18 }}>{c.flag}</td>
                    <td style={{ padding: "6px 10px", fontWeight: 600, color: "#e2e8f0" }}>{c.name}</td>
                    <td style={{ padding: "6px 10px", color: "#4ade80", fontWeight: 700 }}>#{c.fifaRank}</td>
                    <td style={{ padding: "6px 10px" }}>${c.gdpPC.toLocaleString()}</td>
                    <td style={{ padding: "6px 10px" }}>{c.pop}</td>
                    <td style={{ padding: "6px 10px" }}>{c.hdi}</td>
                    <td style={{ padding: "6px 10px" }}>{c.gini}</td>
                    <td style={{ padding: "6px 10px" }}>{c.lifeExp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <div style={{
          textAlign: "center", fontSize: 11, color: "#475569", padding: "20px 0 0",
          borderTop: "1px solid #1e293b",
        }}>
          Data: FIFA Rankings (approximate, 2024) · World Bank · UNDP · For educational demonstration purposes
        </div>
      </div>
    </div>
  );
}
