# ⚽ Economía × FIFA — Demo Interactiva

Demo educativa para explorar la relación entre variables macroeconómicas y los rankings FIFA. Diseñada para estudiantes de preparatoria interesados en economía.

## 🚀 Despliegue rápido (5 minutos)

### Paso 1: Crear el repositorio

```bash
# En tu terminal, dentro de esta carpeta:
git init
git add .
git commit -m "Demo Economía × FIFA"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mundial-econ-demo.git
git push -u origin main
```

### Paso 2: Activar GitHub Pages

1. Ve a **Settings → Pages** en tu repositorio
2. En **Source**, selecciona **GitHub Actions**
3. El workflow se ejecuta automáticamente con cada push

### Paso 3: Acceder al sitio

Tu sitio estará disponible en:
```
https://TU_USUARIO.github.io/mundial-econ-demo/
```

> ⚠️ **Importante**: Si cambias el nombre del repositorio, actualiza también el campo `base` en `vite.config.js`.

## 📱 URLs directas para la sesión

Comparte estas URLs con los estudiantes:

| Actividad | URL |
|-----------|-----|
| **Menú principal** | `https://TU_USUARIO.github.io/mundial-econ-demo/` |
| **Encuesta** | `https://TU_USUARIO.github.io/mundial-econ-demo/#/encuesta` |
| **Modelo predictivo** | `https://TU_USUARIO.github.io/mundial-econ-demo/#/prediccion` |
| **FIFA Hombres** | `https://TU_USUARIO.github.io/mundial-econ-demo/#/fifa-hombres` |
| **FIFA Mujeres** | `https://TU_USUARIO.github.io/mundial-econ-demo/#/fifa-mujeres` |

> 💡 **Tip**: Genera un código QR para la URL de la encuesta y proyéctalo en clase.

## 🏫 Guía para el instructor

### Secuencia sugerida (40-50 min)

1. **Encuesta (5 min)** — Proyectar QR, estudiantes votan en su celular
2. **Resultados + discusión (5 min)** — ¿Por qué votaron así? ¿Qué factores consideraron?
3. **FIFA Hombres × Economía (10 min)** — Explorar variables, discutir correlaciones y outliers
4. **FIFA Mujeres × Economía (10 min)** — Comparar con hombres, discutir rol de instituciones
5. **Modelo Predictivo (15 min)** — Estudiantes ajustan pesos, experimentan con escenarios
6. **Cierre (5 min)** — ¿Coincidió el modelo con la encuesta? ¿Qué variables faltan?

### Preguntas clave para la discusión

- ¿Puede el dinero comprar goles?
- ¿Por qué Uruguay (3.5M hab) es mejor que India (1,400M)?
- ¿Qué explica que EE.UU. sea #2 en mujeres pero #16 en hombres?
- ¿Qué pasa si un modelo solo usa PIB? ¿Qatar gana el mundial?
- ¿Qué variables importantes no están en nuestro modelo?

## 🔧 Desarrollo local

```bash
npm install
npm run dev     # Servidor local en http://localhost:5173
npm run build   # Generar build de producción
```

## ⚠️ Nota sobre la encuesta

La encuesta usa `localStorage` del navegador. Esto significa que:
- Los votos se guardan **por dispositivo/navegador** (no en un servidor central)
- Para ver resultados agregados del salón, se necesitaría un backend (Firebase, Supabase, etc.)
- Para la demo en clase, una alternativa es proyectar la encuesta y que los estudiantes voten a mano alzada mientras tú registras

Si se requiere votación en tiempo real con múltiples dispositivos, se puede migrar a Firebase Realtime Database con pocos cambios.

## 📊 Fuentes de datos

- Rankings FIFA: [inside.fifa.com](https://inside.fifa.com/fifa-world-ranking) (Ene/Dic 2025)
- PIB per cápita, Población, Gini: [World Bank](https://data.worldbank.org/)
- IDH, Esperanza de vida: [UNDP](https://hdr.undp.org/)

---

Tec de Monterrey · Campus Puebla · Departamento de Economía
