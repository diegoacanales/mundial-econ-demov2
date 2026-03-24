# ⚽ Economía × FIFA 2026 — Demo Interactiva (v2)

Demo educativa para explorar la relación entre variables macroeconómicas y los rankings FIFA. Incluye modelo predictivo con 9 variables y simulador estocástico.

> **Nota:** Esta es la versión actualizada. El repo anterior (`mundial-econ-demo`) tenía 6 variables y sin simulador.

## 🚀 Despliegue (5 minutos)

```bash
git init
git add .
git commit -m "Economía × FIFA 2026 v2"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mundial-econ-2026.git
git push -u origin main
```

Luego en GitHub → **Settings → Pages → Source: GitHub Actions**.

Tu sitio: `https://TU_USUARIO.github.io/mundial-econ-2026/`

## 📱 URLs para la sesión

| Actividad | URL |
|-----------|-----|
| Menú principal | `https://TU_USUARIO.github.io/mundial-econ-2026/` |
| Encuesta | `.../#/encuesta` |
| Modelo predictivo | `.../#/prediccion` |
| FIFA Hombres | `.../#/fifa-hombres` |
| FIFA Mujeres | `.../#/fifa-mujeres` |

## 🏫 Guía para el instructor (40–50 min)

1. **Encuesta (5 min)** — QR en pantalla, votan en celular
2. **Resultados + discusión (5 min)** — ¿Por qué votaron así?
3. **FIFA Hombres × Economía (10 min)** — Scatter plots, correlaciones, outliers
4. **FIFA Mujeres × Economía (10 min)** — Comparar con hombres, rol de instituciones
5. **Modelo Predictivo (15 min)** — Ajustar pesos, probar escenarios, simular torneos con ε
6. **Cierre (5 min)** — ¿Coincidió el modelo con la encuesta? ¿Qué variables faltan?

### Momento clave: el simulador

- Con ε = 0%: siempre gana el mismo equipo → modelo determinista
- Con ε = 30%: empiezan las sorpresas → la realidad
- Con ε = 70%: casi cualquiera gana → ¿sirve el modelo?

Eso es literalmente la diferencia entre R² alto y bajo, sin una sola ecuación.

## 📊 Variables del modelo predictivo (9)

| Variable | Fuente | Concepto económico |
|----------|--------|--------------------|
| Ranking FIFA | FIFA (Ene 2026) | Productividad revelada |
| PIB per cápita | World Bank | Riqueza nacional |
| Población | World Bank | Dotación de factores |
| IDH | UNDP | Capital humano agregado |
| Historial mundialista | FIFA | Path dependence |
| Ventaja de local | — | Externalidades geográficas |
| Liga doméstica (IFFHS) | IFFHS 2025 | Ecosistema competitivo |
| Valor del plantel | Transfermarkt (Nov 2025) | Capital humano futbolístico |
| Fútbol = deporte #1 | — | Preferencias reveladas |

## 🔧 Desarrollo local

```bash
npm install
npm run dev
npm run build
```

## ⚠️ Nota sobre la encuesta

Usa `localStorage` (votos por dispositivo). Para votación real multi-dispositivo, migrar a Firebase Realtime Database.

---

Tec de Monterrey · Campus Puebla · Departamento de Economía
