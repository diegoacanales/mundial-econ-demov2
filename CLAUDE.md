# CLAUDE.md

## Project Overview

Educational interactive demo exploring the relationship between macroeconomic variables and FIFA rankings. Built for high school students interested in economics. Used by professors at Tec de Monterrey, Campus Puebla.

**Live site:** Deployed on GitHub Pages via GitHub Actions.

## Tech Stack

- **Framework:** React 18 with Vite 6
- **Routing:** react-router-dom v6, using `HashRouter` (required for GitHub Pages — do not switch to `BrowserRouter`)
- **Charts:** recharts
- **Styling:** Inline styles only — no CSS files, no Tailwind, no CSS modules. Each page is self-contained.
- **Fonts:** Google Fonts loaded via `<link>` inside components (Outfit, Barlow Condensed, DM Sans, Anybody)
- **Storage:** `localStorage` for the survey (EncuestaMundial). No backend.
- **Deploy:** GitHub Pages via `.github/workflows/deploy.yml`

## Project Structure

```
src/
├── main.jsx              # Entry point, wraps App in HashRouter
├── App.jsx               # Landing page + routing + BackButton
└── pages/
    ├── EncuestaMundial.jsx       # Mobile-first survey: "Who wins WC 2026?"
    ├── PrediccionMundial.jsx     # Predictive model dashboard with adjustable weights
    ├── FIFAMenEconomics.jsx      # Men's FIFA rankings vs macro variables
    └── FIFAWomenEconomics.jsx    # Women's FIFA rankings vs macro variables
```

## Key Architecture Decisions

- **Self-contained pages:** Each page in `src/pages/` is a standalone component with its own data, styles, and logic. No shared state, no context providers, no external CSS. This is intentional — it makes each page independently understandable and easy to modify.
- **Hardcoded data:** All country data (GDP, population, HDI, Gini, FIFA rankings, etc.) is embedded as constants at the top of each file. There are no API calls or data files. To update data, edit the arrays directly.
- **Spanish UI:** All user-facing text is in Spanish. Code comments and variable names are in English.
- **No Tailwind:** Styling uses inline `style={{}}` objects throughout. Maintain this pattern.

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Landing` (in App.jsx) | Menu with links to all 4 activities |
| `/encuesta` | `EncuestaMundial` | Mobile survey with localStorage persistence |
| `/prediccion` | `PrediccionMundial` | Adjustable-weight predictive model |
| `/fifa-hombres` | `FIFAMenEconomics` | Scatter plots: men's ranking vs economy |
| `/fifa-mujeres` | `FIFAWomenEconomics` | Scatter plots: women's ranking vs economy |

## Data Conventions

Each dashboard page defines a `COUNTRIES` array at the top with this shape:
```js
{ name: "Argentina", flag: "🇦🇷", continent: "South America",
  fifaRank: 2, gdpPC: 13650, pop: 46, hdi: 0.842, gini: 41.4, lifeExp: 76 }
```

The predictive model (PrediccionMundial) extends this with: `wcWins`, `wcAppear`, `hostAdv`, `confed`.

Variable definitions are in a `VARIABLES` array with: `key`, `label`, `unit`, `desc`, `color`.

Continent/group color mappings are in `CONTINENT_COLORS` or `GROUP_COLORS` objects.

## Design System (informal)

Each page has its own color palette to visually distinguish them:
- **Men's dashboard:** Dark navy + green accents (#4ade80)
- **Women's dashboard:** Dark purple + magenta accents (#e879f9, #c084fc)
- **Survey:** Dark navy + amber accents (#f59e0b)
- **Predictive model:** Dark navy + amber/gold accents (#f59e0b)
- **Landing:** Matches predictive model palette

Common patterns across all pages:
- Dark backgrounds with gradient: `linear-gradient(160deg, #0X... 0%, #0X... 100%)`
- Cards with subtle glass-like borders: `border: 1px solid #1e293b`
- Font stack: display headings use Barlow Condensed (900) or Anybody (800/900), body uses Outfit or DM Sans
- Color-coded interactive elements (buttons, badges) using each page's accent color

## Deployment

**GitHub Pages via GitHub Actions.** The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:
1. `npm ci`
2. `npm run build`
3. Deploys `dist/` to Pages

**Critical:** The `base` field in `vite.config.js` must match the repository name. If the repo is renamed, update `base: '/NEW_REPO_NAME/'`.

## Common Tasks

### Add a new country to a dashboard
Edit the `COUNTRIES` array at the top of the relevant page file. Data sources: World Bank (GDP, Gini, population), UNDP (HDI, life expectancy), FIFA website (rankings).

### Add a new macro variable
1. Add the field to each object in `COUNTRIES`
2. Add an entry to the `VARIABLES` array with key, label, unit, description, and color
3. The scatter chart and correlation logic pick it up automatically

### Add a new page/activity
1. Create `src/pages/NewPage.jsx` with a default export
2. Add an entry to the `PAGES` array in `App.jsx`
3. Routing and the landing menu update automatically

### Upgrade the survey to real-time multi-device
The survey currently uses `localStorage` (per-device). To make votes aggregate across devices, replace `localStorage` calls in `EncuestaMundial.jsx` with Firebase Realtime Database or Supabase. The three functions to change are: the `useEffect` load, `handleVote`, and `handleReset`.

### Update FIFA rankings
Rankings data is hardcoded. Search for the latest FIFA rankings, then update the `fifaRank` field in the `COUNTRIES` arrays across the relevant page files. Men's and women's rankings are in separate files.

## Testing

No test suite. Verify changes by running `npm run dev` and checking each page manually. Build verification: `npm run build` should complete with no errors.

## Known Limitations

- Survey votes don't aggregate across devices (localStorage only)
- Bundle is ~650KB gzipped (recharts is heavy) — acceptable for classroom use on WiFi
- Data is static/hardcoded — updating requires code changes and a new deploy
- No i18n framework — Spanish strings are inline throughout
