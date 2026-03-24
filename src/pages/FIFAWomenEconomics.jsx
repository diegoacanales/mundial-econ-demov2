import { useState, useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const COUNTRIES = [
  { name: "España", flag: "🇪🇸", continent: "Europa", fifaRank: 1, gdpPC: 32280, pop: 48, hdi: 0.905, gini: 33.0, lifeExp: 84 },
  { name: "EE.UU.", flag: "🇺🇸", continent: "Norteamérica", fifaRank: 2, gdpPC: 80035, pop: 334, hdi: 0.921, gini: 39.8, lifeExp: 77 },
  { name: "Alemania", flag: "🇩🇪", continent: "Europa", fifaRank: 3, gdpPC: 51384, pop: 84, hdi: 0.942, gini: 31.7, lifeExp: 81 },
  { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", continent: "Europa", fifaRank: 4, gdpPC: 48913, pop: 56, hdi: 0.929, gini: 35.1, lifeExp: 81 },
  { name: "Suecia", flag: "🇸🇪", continent: "Europa", fifaRank: 5, gdpPC: 55873, pop: 10.5, hdi: 0.947, gini: 28.8, lifeExp: 83 },
  { name: "Francia", flag: "🇫🇷", continent: "Europa", fifaRank: 7, gdpPC: 44408, pop: 68, hdi: 0.903, gini: 31.6, lifeExp: 83 },
  { name: "Brasil", flag: "🇧🇷", continent: "Sudamérica", fifaRank: 8, gdpPC: 10412, pop: 216, hdi: 0.760, gini: 48.9, lifeExp: 76 },
  { name: "Japón", flag: "🇯🇵", continent: "Asia", fifaRank: 9, gdpPC: 33815, pop: 125, hdi: 0.920, gini: 32.9, lifeExp: 85 },
  { name: "Canadá", flag: "🇨🇦", continent: "Norteamérica", fifaRank: 10, gdpPC: 52722, pop: 40, hdi: 0.935, gini: 33.3, lifeExp: 82 },
  { name: "Corea del Norte", flag: "🇰🇵", continent: "Asia", fifaRank: 11, gdpPC: 1800, pop: 26, hdi: 0.733, gini: 35.0, lifeExp: 73 },
  { name: "Países Bajos", flag: "🇳🇱", continent: "Europa", fifaRank: 12, gdpPC: 57025, pop: 18, hdi: 0.946, gini: 28.1, lifeExp: 82 },
  { name: "Italia", flag: "🇮🇹", continent: "Europa", fifaRank: 13, gdpPC: 35657, pop: 59, hdi: 0.895, gini: 32.8, lifeExp: 84 },
  { name: "Noruega", flag: "🇳🇴", continent: "Europa", fifaRank: 14, gdpPC: 87925, pop: 5.5, hdi: 0.961, gini: 27.6, lifeExp: 83 },
  { name: "Australia", flag: "🇦🇺", continent: "Oceanía", fifaRank: 16, gdpPC: 65100, pop: 26, hdi: 0.946, gini: 34.3, lifeExp: 84 },
  { name: "China", flag: "🇨🇳", continent: "Asia", fifaRank: 17, gdpPC: 12720, pop: 1412, hdi: 0.788, gini: 38.2, lifeExp: 78 },
  { name: "Colombia", flag: "🇨🇴", continent: "Sudamérica", fifaRank: 19, gdpPC: 6630, pop: 52, hdi: 0.752, gini: 51.3, lifeExp: 77 },
  { name: "Bélgica", flag: "🇧🇪", continent: "Europa", fifaRank: 20, gdpPC: 51767, pop: 12, hdi: 0.937, gini: 27.2, lifeExp: 82 },
  { name: "Corea del Sur", flag: "🇰🇷", continent: "Asia", fifaRank: 21, gdpPC: 32423, pop: 52, hdi: 0.929, gini: 31.4, lifeExp: 84 },
  { name: "Portugal", flag: "🇵🇹", continent: "Europa", fifaRank: 23, gdpPC: 26780, pop: 10, hdi: 0.866, gini: 33.8, lifeExp: 82 },
  { name: "México", flag: "🇲🇽", continent: "Norteamérica", fifaRank: 29, gdpPC: 12673, pop: 130, hdi: 0.758, gini: 45.4, lifeExp: 75 },
  { name: "Argentina", flag: "🇦🇷", continent: "Sudamérica", fifaRank: 35, gdpPC: 13650, pop: 46, hdi: 0.842, gini: 41.4, lifeExp: 77 },
  { name: "Costa Rica", flag: "🇨🇷", continent: "Norteamérica", fifaRank: 37, gdpPC: 13280, pop: 5.2, hdi: 0.806, gini: 48.2, lifeExp: 80 },
  { name: "Nigeria", flag: "🇳🇬", continent: "África", fifaRank: 39, gdpPC: 2184, pop: 224, hdi: 0.535, gini: 35.1, lifeExp: 53 },
  { name: "Ghana", flag: "🇬🇭", continent: "África", fifaRank: 58, gdpPC: 2363, pop: 34, hdi: 0.602, gini: 43.5, lifeExp: 64 },
  { name: "Uruguay", flag: "🇺🇾", continent: "Sudamérica", fifaRank: 56, gdpPC: 21576, pop: 3.5, hdi: 0.830, gini: 39.7, lifeExp: 78 },
  { name: "India", flag: "🇮🇳", continent: "Asia", fifaRank: 67, gdpPC: 2612, pop: 1428, hdi: 0.644, gini: 35.2, lifeExp: 68 },
  { name: "Senegal", flag: "🇸🇳", continent: "África", fifaRank: 88, gdpPC: 1712, pop: 18, hdi: 0.511, gini: 40.3, lifeExp: 68 },
  { name: "Qatar", flag: "🇶🇦", continent: "Asia", fifaRank: 130, gdpPC: 87662, pop: 2.9, hdi: 0.855, gini: 41.1, lifeExp: 80 },
  { name: "Arabia Saudita", flag: "🇸🇦", continent: "Asia", fifaRank: 161, gdpPC: 32586, pop: 37, hdi: 0.875, gini: 45.9, lifeExp: 78 },
];

const VARIABLES = [
  { key: "gdpPC", label: "PIB per Cápita", unit: "USD", desc: "La producción económica promedio por persona — una medida de qué tan rico es un país en promedio.", color: "#22c55e" },
  { key: "pop", label: "Población", unit: "millones", desc: "Número total de personas en el país — ¿tener más gente significa más talento para elegir?", color: "#f59e0b" },
  { key: "hdi", label: "Índice de Desarrollo Humano", unit: "(0–1)", desc: "Un indicador compuesto de salud, educación e ingreso — captura la calidad de vida más allá del dinero.", color: "#8b5cf6" },
  { key: "gini", label: "Coeficiente de Gini", unit: "(0–100)", desc: "Mide la desigualdad de ingreso — 0 significa igualdad perfecta, 100 significa que una persona tiene todo.", color: "#ef4444" },
  { key: "lifeExp", label: "Esperanza de Vida", unit: "años", desc: "Número promedio de años que se espera que viva una persona — refleja salud, nutrición y condiciones de vida.", color: "#06b6d4" },
];

const CONTINENT_COLORS = {
  "Europa": "#60a5fa",
  "Sudamérica": "#34d399",
  "Norteamérica": "#f97316",
  "Asia": "#facc15",
  "África": "#c084fc",
  "Oceanía": "#fb7185",
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background: "#1e1028", border: "1px solid #4c1d95", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{d.flag} {d.name}</div>
      <div style={{ color: "#c4b5fd" }}>Ranking FIFA Femenil: <span style={{ color: "#e879f9", fontWeight: 600 }}>#{d.fifaRank}</span></div>
      <div style={{ color: "#c4b5fd" }}>PIB/cáp: <span style={{ color: "#e2e8f0" }}>${d.gdpPC.toLocaleString()}</span></div>
      <div style={{ color: "#c4b5fd" }}>Pob: <span style={{ color: "#e2e8f0" }}>{d.pop}M</span></div>
      <div style={{ color: "#c4b5fd" }}>IDH: <span style={{ color: "#e2e8f0" }}>{d.hdi}</span></div>
      <div style={{ color: "#c4b5fd" }}>Gini: <span style={{ color: "#e2e8f0" }}>{d.gini}</span></div>
    </div>
  );
};

const InsightCard = ({ emoji, title, text }) => (
  <div style={{
    background: "linear-gradient(135deg, rgba(49,18,75,0.7), rgba(20,10,35,0.9))",
    border: "1px solid #581c87",
    borderRadius: 12,
    padding: "16px 18px",
    flex: "1 1 280px",
  }}>
    <div style={{ fontSize: 22, marginBottom: 6 }}>{emoji}</div>
    <div style={{ fontWeight: 700, fontSize: 14, color: "#e9d5ff", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>{title}</div>
    <div style={{ fontSize: 13, color: "#a78bfa", lineHeight: 1.55, fontFamily: "'DM Sans', sans-serif" }}>{text}</div>
  </div>
);

export default function FIFAWomenEconomics() {
  const [selectedVar, setSelectedVar] = useState("gdpPC");
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

  const corrColor = Math.abs(correlation) > 0.4 ? (correlation < 0 ? "#c084fc" : "#f87171") : "#fbbf24";
  const corrLabel = Math.abs(correlation) < 0.2 ? "Muy débil" : Math.abs(correlation) < 0.4 ? "Débil" : Math.abs(correlation) < 0.6 ? "Moderada" : "Fuerte";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0d0015 0%, #1a0a2e 40%, #120826 100%)",
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
        borderBottom: "1px solid rgba(192,132,252,0.2)",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(90deg, #c084fc 0px, #c084fc 2px, transparent 2px, transparent 80px)" }} />
        <div style={{ position: "relative", maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
            <span style={{ fontSize: 36 }}>⚽</span>
            <span style={{
              fontFamily: "'Anybody', sans-serif",
              fontWeight: 900,
              fontSize: 30,
              background: "linear-gradient(135deg, #c084fc, #f472b6, #e879f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}>
              ECONOMÍA × FIFA MUJERES
            </span>
          </div>
          <p style={{ fontSize: 16, color: "#a78bfa", maxWidth: 640, lineHeight: 1.6, margin: 0 }}>
            ¿La riqueza predice el éxito en el fútbol femenil — o la cultura, las políticas públicas y la equidad de género importan más? Explora cómo las variables macroeconómicas se relacionan con el ranking mundial femenil de la FIFA.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* VARIABLE SELECTOR */}
        <div style={{ margin: "32px 0 8px" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "#7c3aed", marginBottom: 12 }}>Elige una variable macroeconómica</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {VARIABLES.map(v => (
              <button
                key={v.key}
                onClick={() => setSelectedVar(v.key)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: selectedVar === v.key ? `2px solid ${v.color}` : "2px solid #2d1b4e",
                  background: selectedVar === v.key ? `${v.color}18` : "#140a23",
                  color: selectedVar === v.key ? v.color : "#a78bfa",
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
          color: "#d4d4e4",
          lineHeight: 1.5,
        }}>
          <strong style={{ color: variable.color }}>{variable.label}</strong> ({variable.unit}): {variable.desc}
        </div>

        {/* CORRELATION BADGE */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#140a23", border: "1px solid #3b0764", borderRadius: 10, padding: "8px 16px",
          }}>
            <span style={{ fontSize: 12, color: "#a78bfa" }}>Correlación:</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: corrColor, fontFamily: "'Anybody', sans-serif" }}>{correlation}</span>
            <span style={{ fontSize: 11, color: corrColor, fontWeight: 600, textTransform: "uppercase" }}>{corrLabel}</span>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13, color: "#a78bfa" }}>
            <input type="checkbox" checked={showLabels} onChange={() => setShowLabels(!showLabels)} style={{ accentColor: "#c084fc" }} />
            Mostrar nombres
          </label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginLeft: "auto" }}>
            {Object.entries(CONTINENT_COLORS).map(([c, col]) => (
              <span key={c} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#a78bfa" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col, display: "inline-block" }} />{c}
              </span>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: "#7c3aed", marginBottom: 8, fontStyle: "italic" }}>
          ↑ Menor ranking = mejor equipo. Pasa el cursor sobre los puntos para ver detalles.
        </div>

        {/* CHART */}
        <div style={{
          background: "linear-gradient(135deg, #140a23, #1e1028)",
          border: "1px solid #2d1b4e",
          borderRadius: 16,
          padding: "24px 12px 12px 0",
          marginBottom: 32,
        }}>
          <ResponsiveContainer width="100%" height={440}>
            <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
              <CartesianGrid strokeDasharray="3 6" stroke="#2d1b4e" />
              <XAxis
                dataKey="x"
                type="number"
                name={variable.label}
                tick={{ fill: "#7c3aed", fontSize: 11 }}
                axisLine={{ stroke: "#3b0764" }}
                tickLine={{ stroke: "#3b0764" }}
                label={{ value: `${variable.label} (${variable.unit})`, position: "bottom", offset: 10, fill: "#a78bfa", fontSize: 13 }}
                domain={selectedVar === "hdi" ? [0.4, 1] : undefined}
              />
              <YAxis
                dataKey="y"
                type="number"
                name="Ranking FIFA Femenil"
                reversed
                tick={{ fill: "#7c3aed", fontSize: 11 }}
                axisLine={{ stroke: "#3b0764" }}
                tickLine={{ stroke: "#3b0764" }}
                label={{ value: "Ranking FIFA Femenil ←  Mejor", angle: -90, position: "insideLeft", offset: 10, fill: "#a78bfa", fontSize: 13 }}
                domain={[0, 175]}
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
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r={7} fill={color} fillOpacity={0.8} stroke={color} strokeWidth={1.5} strokeOpacity={0.4} />
                        {showLabels && (
                          <text x={cx + 10} y={cy + 4} fill="#a78bfa" fontSize={10} fontFamily="DM Sans">
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

        {/* KEY COMPARISON: MEN vs WOMEN */}
        <div style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.08))",
          border: "1px solid #581c87",
          borderRadius: 14,
          padding: "20px 22px",
          marginBottom: 28,
        }}>
          <div style={{
            fontFamily: "'Anybody', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            color: "#e879f9",
            marginBottom: 12,
          }}>
            🔄 Hombres vs Mujeres: Cambios sorprendentes en ranking
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
            {[
              { country: "🇺🇸 EE.UU.", men: "#16", women: "#2", dir: "↑", note: "Efecto Título IX" },
              { country: "🇧🇷 Brasil", men: "#1", women: "#8", dir: "↓", note: "Menor inversión" },
              { country: "🇦🇷 Argentina", men: "#2", women: "#35", dir: "↓↓", note: "Brecha enorme" },
              { country: "🇸🇪 Suecia", men: "fuera del top 20", women: "#5", dir: "↑↑", note: "Equidad de género" },
              { country: "🇸🇦 Arabia Saudita", men: "#56", women: "#161", dir: "↓↓↓", note: "Barreras estructurales" },
              { country: "🇰🇵 Corea del Norte", men: "~#100+", women: "#11", dir: "↑↑", note: "Programa estatal" },
            ].map((r, i) => (
              <div key={i} style={{
                background: "#0d0015",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #2d1b4e",
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#e2e8f0", marginBottom: 4 }}>{r.country}</div>
                <div style={{ fontSize: 12, color: "#a78bfa" }}>
                  Hombres: <span style={{ color: "#94a3b8" }}>{r.men}</span> → Mujeres: <span style={{ color: "#e879f9", fontWeight: 700 }}>{r.women}</span>
                </div>
                <div style={{ fontSize: 11, color: "#7c3aed", marginTop: 2 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DISCUSSION QUESTIONS */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontFamily: "'Anybody', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: "#e879f9",
            marginBottom: 16,
            letterSpacing: "-0.3px"
          }}>
            🧠 Piensa como economista
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <InsightCard
              emoji="🏛️"
              title="Las instituciones importan"
              text="La ley Título IX de EE.UU. (1972) obligó a dar financiamiento equitativo al deporte universitario femenino. No hizo más rico al país — pero hizo dominante a su selección femenil. Esto es 'economía institucional' en acción."
            />
            <InsightCard
              emoji="⚖️"
              title="Equidad de género como variable"
              text="Arabia Saudita (PIB/cáp $32K) está en el puesto #161 en fútbol femenil. Suecia (PIB/cáp $56K) en el #5. Pero el PIB no explica todo — ¿cuándo se les permitió jugar a las mujeres? Las normas culturales son una 'variable omitida'."
            />
            <InsightCard
              emoji="🔀"
              title="Compara con el varonil"
              text="Argentina pasa del #2 (hombres) al #35 (mujeres). Brasil del #1 al #8. Corea del Norte de ~#100 al #11. ¿Qué explica estos cambios? La economía sola no puede — necesitas pensar en políticas, cultura e inversión."
            />
          </div>
        </div>

        {/* DATA TABLE */}
        <details style={{ marginBottom: 24 }}>
          <summary style={{
            cursor: "pointer", fontWeight: 600, fontSize: 14, color: "#a78bfa", padding: "10px 0",
            borderBottom: "1px solid #2d1b4e", userSelect: "none",
          }}>
            📋 Ver datos de todos los países ({COUNTRIES.length} países)
          </summary>
          <div style={{ overflowX: "auto", marginTop: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #3b0764" }}>
                  {["", "País", "Rank Fem.", "PIB/cáp", "Pob (M)", "IDH", "Gini", "Esp. Vida"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "#7c3aed", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...COUNTRIES].sort((a, b) => a.fifaRank - b.fifaRank).map((c, i) => (
                  <tr key={c.name} style={{ borderBottom: "1px solid #2d1b4e", background: i % 2 === 0 ? "transparent" : "rgba(49,18,75,0.2)" }}>
                    <td style={{ padding: "6px 10px", fontSize: 18 }}>{c.flag}</td>
                    <td style={{ padding: "6px 10px", fontWeight: 600, color: "#e2e8f0" }}>{c.name}</td>
                    <td style={{ padding: "6px 10px", color: "#e879f9", fontWeight: 700 }}>#{c.fifaRank}</td>
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
          textAlign: "center", fontSize: 11, color: "#581c87", padding: "20px 0 0",
          borderTop: "1px solid #2d1b4e",
        }}>
          Datos: Rankings FIFA Femenil (dic 2025) · Banco Mundial · PNUD · Para fines educativos
        </div>
      </div>
    </div>
  );
}
