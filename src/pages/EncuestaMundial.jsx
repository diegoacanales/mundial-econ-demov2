import { useState, useEffect, useCallback } from "react";

const TEAMS = [
  { name: "Argentina", flag: "🇦🇷", group: "Favoritos" },
  { name: "Francia", flag: "🇫🇷", group: "Favoritos" },
  { name: "Brasil", flag: "🇧🇷", group: "Favoritos" },
  { name: "España", flag: "🇪🇸", group: "Favoritos" },
  { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "Favoritos" },
  { name: "Alemania", flag: "🇩🇪", group: "Contendientes" },
  { name: "Portugal", flag: "🇵🇹", group: "Contendientes" },
  { name: "Países Bajos", flag: "🇳🇱", group: "Contendientes" },
  { name: "Bélgica", flag: "🇧🇪", group: "Contendientes" },
  { name: "Italia", flag: "🇮🇹", group: "Contendientes" },
  { name: "Uruguay", flag: "🇺🇾", group: "Contendientes" },
  { name: "Colombia", flag: "🇨🇴", group: "Contendientes" },
  { name: "Croacia", flag: "🇭🇷", group: "Contendientes" },
  { name: "EE.UU.", flag: "🇺🇸", group: "Anfitriones" },
  { name: "México", flag: "🇲🇽", group: "Anfitriones" },
  { name: "Canadá", flag: "🇨🇦", group: "Anfitriones" },
  { name: "Japón", flag: "🇯🇵", group: "Sorpresa" },
  { name: "Corea del Sur", flag: "🇰🇷", group: "Sorpresa" },
  { name: "Marruecos", flag: "🇲🇦", group: "Sorpresa" },
  { name: "Senegal", flag: "🇸🇳", group: "Sorpresa" },
  { name: "Nigeria", flag: "🇳🇬", group: "Sorpresa" },
  { name: "Ecuador", flag: "🇪🇨", group: "Sorpresa" },
];

const GROUP_COLORS = {
  Favoritos: "#f59e0b",
  Contendientes: "#3b82f6",
  Anfitriones: "#10b981",
  Sorpresa: "#ec4899",
};

const STORAGE_KEY = "wc2026-survey-votes";
const USER_VOTED_KEY = "wc2026-user-voted";
const MODE_KEY = "wc2026-survey-mode";

export default function EncuestaMundial() {
  const [votes, setVotes] = useState({});
  const [selected, setSelected] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Todos");
  const [submitting, setSubmitting] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [presenterMode, setPresenterMode] = useState(false);
  const [lastVote, setLastVote] = useState(null);
  const [flashTeam, setFlashTeam] = useState(null);

  useEffect(() => {
    try {
      const savedVotes = localStorage.getItem(STORAGE_KEY);
      if (savedVotes) setVotes(JSON.parse(savedVotes));
    } catch (e) {}
    try {
      const savedUserVote = localStorage.getItem(USER_VOTED_KEY);
      if (savedUserVote) {
        setHasVoted(true);
        setShowResults(true);
        setSelected(savedUserVote);
      }
    } catch (e) {}
    try {
      const savedMode = localStorage.getItem(MODE_KEY);
      if (savedMode === "presenter") setPresenterMode(true);
    } catch (e) {}
    setLoading(false);
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const handleVote = useCallback(async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    const newVotes = { ...votes, [selected]: (votes[selected] || 0) + 1 };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVotes));
      localStorage.setItem(USER_VOTED_KEY, selected);
      setVotes(newVotes);
      setHasVoted(true);
      setTimeout(() => setShowResults(true), 300);
    } catch (e) {
      console.error(e);
    }
    setSubmitting(false);
  }, [selected, votes, submitting]);

  const handlePresenterVote = useCallback((teamName) => {
    const newVotes = { ...votes, [teamName]: (votes[teamName] || 0) + 1 };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVotes));
    } catch (e) {}
    setVotes(newVotes);
    setLastVote(teamName);
    setFlashTeam(teamName);
    setTimeout(() => setFlashTeam(null), 400);
  }, [votes]);

  const handleUndo = useCallback(() => {
    if (!lastVote) return;
    const current = votes[lastVote] || 0;
    const newVotes = { ...votes };
    if (current <= 1) {
      delete newVotes[lastVote];
    } else {
      newVotes[lastVote] = current - 1;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVotes));
    } catch (e) {}
    setVotes(newVotes);
    setLastVote(null);
  }, [lastVote, votes]);

  const handleReset = useCallback(async () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(USER_VOTED_KEY);
      setVotes({});
      setHasVoted(false);
      setShowResults(false);
      setSelected(null);
      setLastVote(null);
    } catch (e) {}
  }, []);

  const toggleMode = useCallback(() => {
    const newMode = !presenterMode;
    setPresenterMode(newMode);
    try {
      localStorage.setItem(MODE_KEY, newMode ? "presenter" : "individual");
    } catch (e) {}
    if (newMode) {
      // Reset individual mode state when switching to presenter
      setHasVoted(false);
      setShowResults(false);
      setSelected(null);
      try { localStorage.removeItem(USER_VOTED_KEY); } catch (e) {}
    }
  }, [presenterMode]);

  const sortedTeams = [...TEAMS].sort((a, b) => (votes[b.name] || 0) - (votes[a.name] || 0));
  const teamsWithVotes = sortedTeams.filter(t => (votes[t.name] || 0) > 0);
  const maxVotes = Math.max(...TEAMS.map(t => votes[t.name] || 0), 1);

  const groups = ["Todos", "Favoritos", "Contendientes", "Anfitriones", "Sorpresa"];
  const filteredTeams = filter === "Todos" ? TEAMS : TEAMS.filter(t => t.group === filter);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050a12", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#f59e0b", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20 }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #050a12 0%, #0a1628 50%, #0d1f3c 100%)",
      color: "#e2e8f0",
      fontFamily: "'Barlow Condensed', sans-serif",
      padding: 0,
      overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800;900&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes barGrow { from { width: 0; } }
        @keyframes flash { 0% { background: rgba(245,158,11,0.3); } 100% { background: transparent; } }
        .team-btn { transition: all 0.18s ease; }
        .team-btn:active { transform: scale(0.96); }
        .bar-anim { animation: barGrow 0.6s ease-out forwards; }
        .flash-vote { animation: flash 0.4s ease-out; }
      `}</style>

      {/* HEADER */}
      <div style={{
        padding: "36px 20px 28px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? "translateY(0)" : "translateY(-10px)",
        transition: "all 0.5s ease",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <h1 style={{
            fontWeight: 900,
            fontSize: 34,
            margin: "0 0 4px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #f59e0b, #fbbf24, #f97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}>
            Mundial 2026
          </h1>
          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: "#94a3b8",
            margin: 0,
            fontWeight: 400,
          }}>
            {presenterMode
              ? `${totalVotes} voto${totalVotes !== 1 ? 's' : ''} registrado${totalVotes !== 1 ? 's' : ''}`
              : showResults
                ? `${totalVotes} voto${totalVotes !== 1 ? 's' : ''} registrado${totalVotes !== 1 ? 's' : ''}`
                : "¿Quién crees que ganará?"}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: presenterMode ? 900 : 480, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* MODE TOGGLE */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 20,
        }}>
          <button
            onClick={toggleMode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 24,
              border: presenterMode ? "1px solid rgba(245,158,11,0.4)" : "1px solid #1e293b",
              background: presenterMode ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
              color: presenterMode ? "#f59e0b" : "#64748b",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 16 }}>{presenterMode ? "📡" : "👤"}</span>
            {presenterMode ? "Modo Presentador" : "Modo Individual"}
          </button>
        </div>

        {presenterMode ? (
          /* ==================== PRESENTER MODE ==================== */
          <>
            {/* Instruction */}
            <div style={{
              textAlign: "center",
              padding: "10px 16px",
              marginBottom: 16,
              background: "rgba(245,158,11,0.06)",
              borderRadius: 10,
              border: "1px solid rgba(245,158,11,0.15)",
            }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#94a3b8" }}>
                Toca un equipo para registrar un voto. Los resultados se actualizan en vivo.
              </span>
            </div>

            {/* FILTER TABS */}
            <div style={{
              display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16,
              justifyContent: "center",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}>
              {groups.map(g => (
                <button
                  key={g}
                  onClick={() => setFilter(g)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: "none",
                    background: filter === g ? (g === "Todos" ? "#f59e0b" : GROUP_COLORS[g] || "#f59e0b") : "rgba(255,255,255,0.06)",
                    color: filter === g ? "#050a12" : "#94a3b8",
                    fontWeight: filter === g ? 800 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* TWO-COLUMN LAYOUT: Teams + Results */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {/* Team Grid */}
              <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {filteredTeams.map((team, i) => {
                    const groupColor = GROUP_COLORS[team.group];
                    const count = votes[team.name] || 0;
                    const isFlashing = flashTeam === team.name;
                    return (
                      <button
                        key={team.name}
                        className={`team-btn ${isFlashing ? "flash-vote" : ""}`}
                        onClick={() => handlePresenterVote(team.name)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "12px 12px",
                          borderRadius: 12,
                          border: `2px solid ${count > 0 ? groupColor + "44" : "transparent"}`,
                          background: "rgba(255,255,255,0.03)",
                          color: "#e2e8f0",
                          cursor: "pointer",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 16,
                          fontWeight: 600,
                          textAlign: "left",
                          opacity: animateIn ? 1 : 0,
                          transform: animateIn ? "translateY(0)" : "translateY(12px)",
                          transition: `all 0.3s ease ${i * 0.03}s`,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <span style={{ fontSize: 26 }}>{team.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ lineHeight: 1.2, letterSpacing: "0.5px" }}>{team.name}</div>
                          <div style={{ fontSize: 10, color: groupColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{team.group}</div>
                        </div>
                        {count > 0 && (
                          <span style={{
                            background: groupColor,
                            color: "#050a12",
                            fontWeight: 900,
                            fontSize: 13,
                            padding: "2px 8px",
                            borderRadius: 10,
                            minWidth: 24,
                            textAlign: "center",
                          }}>{count}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Results */}
              <div style={{ flex: "1 1 280px", minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 14 }}>
                  Resultados en vivo
                </div>
                {teamsWithVotes.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0", color: "#334155", fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>
                    Aún no hay votos
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {teamsWithVotes.map((team, i) => {
                      const count = votes[team.name] || 0;
                      const pct = totalVotes > 0 ? ((count / totalVotes) * 100) : 0;
                      return (
                        <div
                          key={team.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#475569", width: 20, textAlign: "right" }}>{i + 1}</span>
                          <span style={{ fontSize: 20 }}>{team.flag}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                              <span style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0", letterSpacing: "0.3px" }}>{team.name}</span>
                              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
                                {count} <span style={{ color: "#f59e0b" }}>({pct.toFixed(0)}%)</span>
                              </span>
                            </div>
                            <div style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                              <div
                                style={{
                                  height: "100%",
                                  width: `${(count / maxVotes) * 100}%`,
                                  borderRadius: 3,
                                  background: `linear-gradient(90deg, ${GROUP_COLORS[team.group]}88, ${GROUP_COLORS[team.group]}44)`,
                                  transition: "width 0.3s ease",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Undo + Reset */}
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  <button
                    onClick={handleUndo}
                    disabled={!lastVote}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid #1e293b",
                      background: lastVote ? "rgba(255,255,255,0.04)" : "transparent",
                      color: lastVote ? "#94a3b8" : "#1e293b",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      cursor: lastVote ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    ↩ Deshacer
                  </button>
                  <button
                    onClick={handleReset}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: 10,
                      border: "1px solid #1e293b",
                      background: "transparent",
                      color: "#64748b",
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Reiniciar
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ==================== INDIVIDUAL MODE (original) ==================== */
          <>
            {!showResults ? (
              <>
                {/* FILTER TABS */}
                <div style={{
                  display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 16,
                  WebkitOverflowScrolling: "touch",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}>
                  {groups.map(g => (
                    <button
                      key={g}
                      onClick={() => setFilter(g)}
                      style={{
                        padding: "7px 14px",
                        borderRadius: 20,
                        border: "none",
                        background: filter === g ? (g === "Todos" ? "#f59e0b" : GROUP_COLORS[g] || "#f59e0b") : "rgba(255,255,255,0.06)",
                        color: filter === g ? "#050a12" : "#94a3b8",
                        fontWeight: filter === g ? 800 : 500,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "'Barlow Condensed', sans-serif",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>

                {/* TEAM GRID */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
                  {filteredTeams.map((team, i) => {
                    const isSelected = selected === team.name;
                    const groupColor = GROUP_COLORS[team.group];
                    return (
                      <button
                        key={team.name}
                        className="team-btn"
                        onClick={() => setSelected(team.name)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "14px 14px",
                          borderRadius: 12,
                          border: isSelected ? `2px solid ${groupColor}` : "2px solid transparent",
                          background: isSelected
                            ? `linear-gradient(135deg, ${groupColor}18, ${groupColor}08)`
                            : "rgba(255,255,255,0.03)",
                          color: isSelected ? "#f8fafc" : "#94a3b8",
                          cursor: "pointer",
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 16,
                          fontWeight: isSelected ? 700 : 500,
                          textAlign: "left",
                          opacity: animateIn ? 1 : 0,
                          transform: animateIn ? "translateY(0)" : "translateY(12px)",
                          transition: `all 0.3s ease ${i * 0.03}s`,
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {isSelected && (
                          <div style={{
                            position: "absolute", top: 6, right: 8,
                            width: 18, height: 18, borderRadius: "50%",
                            background: groupColor,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, color: "#050a12", fontWeight: 900,
                          }}>✓</div>
                        )}
                        <span style={{ fontSize: 28 }}>{team.flag}</span>
                        <div>
                          <div style={{ lineHeight: 1.2, letterSpacing: "0.5px" }}>{team.name}</div>
                          <div style={{ fontSize: 10, color: groupColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{team.group}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* VOTE BUTTON */}
                <button
                  onClick={handleVote}
                  disabled={!selected || submitting}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: 14,
                    border: "none",
                    background: selected
                      ? "linear-gradient(135deg, #f59e0b, #f97316)"
                      : "rgba(255,255,255,0.06)",
                    color: selected ? "#050a12" : "#475569",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 20,
                    fontWeight: 900,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    cursor: selected ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    animation: selected ? "pulse 2s infinite" : "none",
                  }}
                >
                  {submitting ? "Enviando..." : selected ? `Votar por ${selected}` : "Selecciona un equipo"}
                </button>
              </>
            ) : (
              <>
                {/* YOUR VOTE */}
                {hasVoted && (
                  <div style={{
                    textAlign: "center",
                    padding: "16px",
                    marginBottom: 20,
                    background: "rgba(245,158,11,0.08)",
                    borderRadius: 14,
                    border: "1px solid rgba(245,158,11,0.2)",
                  }}>
                    <div style={{ fontSize: 13, color: "#f59e0b", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Tu predicción</div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>
                      {TEAMS.find(t => t.name === selected)?.flag} {selected}
                    </div>
                  </div>
                )}

                {/* RESULTS */}
                <div style={{ fontSize: 12, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, marginBottom: 14 }}>
                  Resultados en vivo
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {sortedTeams.map((team, i) => {
                    const count = votes[team.name] || 0;
                    const pct = totalVotes > 0 ? ((count / totalVotes) * 100) : 0;
                    const isYours = team.name === selected;
                    return (
                      <div
                        key={team.name}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: isYours ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.02)",
                          border: isYours ? "1px solid rgba(245,158,11,0.2)" : "1px solid transparent",
                          opacity: count === 0 && i > 8 ? 0.4 : 1,
                        }}
                      >
                        <span style={{ fontSize: 13, fontWeight: 800, color: "#475569", width: 22, textAlign: "right" }}>{i + 1}</span>
                        <span style={{ fontSize: 22 }}>{team.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                            <span style={{ fontWeight: 700, fontSize: 15, color: isYours ? "#f59e0b" : "#e2e8f0", letterSpacing: "0.3px" }}>{team.name}</span>
                            <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                              {count} {pct > 0 && <span style={{ color: "#f59e0b" }}>({pct.toFixed(0)}%)</span>}
                            </span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                            <div
                              className="bar-anim"
                              style={{
                                height: "100%",
                                width: `${(count / maxVotes) * 100}%`,
                                borderRadius: 3,
                                background: isYours
                                  ? "linear-gradient(90deg, #f59e0b, #f97316)"
                                  : `linear-gradient(90deg, ${GROUP_COLORS[team.group]}88, ${GROUP_COLORS[team.group]}44)`,
                                animationDelay: `${i * 0.05}s`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RESET */}
                <button
                  onClick={handleReset}
                  style={{
                    width: "100%",
                    marginTop: 24,
                    padding: "12px",
                    borderRadius: 10,
                    border: "1px solid #1e293b",
                    background: "transparent",
                    color: "#64748b",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  🔄 Reiniciar encuesta (nueva sesión)
                </button>
              </>
            )}
          </>
        )}

        <div style={{ textAlign: "center", fontSize: 10, color: "#334155", marginTop: 28, fontFamily: "'Outfit', sans-serif" }}>
          Encuesta para fines educativos · Economía & FIFA · Tec de Monterrey
        </div>
      </div>
    </div>
  );
}
