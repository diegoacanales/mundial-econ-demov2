# CLAUDE.md

## Project Overview

Educational interactive demo: macroeconomic variables vs FIFA rankings + predictive model for World Cup 2026. Built for high school students. Used at Tec de Monterrey, Campus Puebla.

**Successor to:** `mundial-econ-demo` (6 variables, no simulator). This version adds 3 variables + stochastic simulator.

## Tech Stack

- React 18, Vite 6, react-router-dom v6 (HashRouter — required for GitHub Pages)
- recharts for charts
- Inline styles only — no CSS files, no Tailwind
- Google Fonts: Outfit, Barlow Condensed, DM Sans, Anybody
- localStorage for survey persistence. No backend.
- GitHub Pages via `.github/workflows/deploy.yml`

## Structure

```
src/
├── main.jsx
├── App.jsx              # Landing + routing + BackButton
└── pages/
    ├── EncuestaMundial.jsx       # Survey (localStorage)
    ├── PrediccionMundial.jsx     # 9-variable model + stochastic sim
    ├── FIFAMenEconomics.jsx      # Men's scatter plots
    └── FIFAWomenEconomics.jsx    # Women's scatter plots
```

## Key Decisions

- **Self-contained pages** with embedded data and inline styles. No shared state.
- **Spanish UI**, English code. UTF-8 accents (never escaped).
- **9 predictive variables:** FIFA rank, GDP/cap, population, HDI, Gini (in data but not weighted), WC history, host advantage, IFFHS league score, Transfermarkt squad value, football-as-primary-sport dummy.
- **Stochastic element:** Box-Muller gaussian noise scaled by noise slider (0–80%). Each "Simular torneo" click runs one tournament with random perturbation. History accumulates as frequency chips.

## Routes

| Path | Component |
|------|-----------|
| `/` | Landing (App.jsx) |
| `/encuesta` | EncuestaMundial |
| `/prediccion` | PrediccionMundial |
| `/fifa-hombres` | FIFAMenEconomics |
| `/fifa-mujeres` | FIFAWomenEconomics |

## Data Shape

```js
// Predictive model (PrediccionMundial)
{ name, flag, fifaRank, gdpPC, pop, hdi, gini, wcWins, wcAppear,
  hostAdv, iffhs, sqVal, futPrimary, continent }

// Scatter dashboards (FIFAMen/WomenEconomics)
{ name, flag, continent, fifaRank, gdpPC, pop, hdi, gini, lifeExp }
```

## Common Tasks

### Update data
Edit `COUNTRIES` or `TEAMS` arrays at top of each page file. Sources: FIFA, World Bank, UNDP, IFFHS, Transfermarkt.

### Add a variable
1. Add field to TEAMS array
2. Add entry to FACTORS array
3. Add scoring logic in `computeScores`
4. Add default weight to PRESETS

### Add a page
1. Create `src/pages/NewPage.jsx` with default export
2. Add to PAGES array in App.jsx

### Deploy
Push to main. GitHub Actions builds and deploys automatically. If repo name changes, update `base` in `vite.config.js`.

## Known Limitations

- Survey: localStorage only (per-device, not shared)
- Bundle ~650KB gzipped (recharts)
- Static data, no API calls
- No i18n framework
