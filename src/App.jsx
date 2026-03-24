import { Routes, Route, Link, useLocation } from 'react-router-dom'
import FIFAMenEconomics from './pages/FIFAMenEconomics'
import FIFAWomenEconomics from './pages/FIFAWomenEconomics'
import EncuestaMundial from './pages/EncuestaMundial'
import PrediccionMundial from './pages/PrediccionMundial'

const PAGES = [
  { path: '/encuesta', label: '🗳️ Encuesta', desc: '¿Quién ganará el Mundial 2026?', color: '#f59e0b', component: EncuestaMundial },
  { path: '/prediccion', label: '🤖 Modelo Predictivo', desc: 'Construye tu propio modelo con variables económicas', color: '#3b82f6', component: PrediccionMundial },
  { path: '/fifa-hombres', label: '⚽ FIFA Hombres × Economía', desc: 'Ranking masculino vs variables macroeconómicas', color: '#22c55e', component: FIFAMenEconomics },
  { path: '/fifa-mujeres', label: '⚽ FIFA Mujeres × Economía', desc: 'Ranking femenino vs variables macroeconómicas', color: '#c084fc', component: FIFAWomenEconomics },
]

function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #050a12 0%, #0a1628 50%, #0d1f3c 100%)',
      color: '#e2e8f0',
      fontFamily: "'Outfit', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '60px 20px 40px',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet" />

      <div style={{ fontSize: 64, marginBottom: 16 }}>⚽</div>
      <h1 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900,
        fontSize: 42,
        textAlign: 'center',
        margin: '0 0 8px',
        letterSpacing: '1px',
        background: 'linear-gradient(135deg, #f59e0b, #fbbf24, #f8fafc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        ECONOMÍA × FIFA
      </h1>
      <p style={{ fontSize: 16, color: '#94a3b8', textAlign: 'center', maxWidth: 480, margin: '0 0 40px', lineHeight: 1.6 }}>
        Demo interactiva para explorar la relación entre variables macroeconómicas y el fútbol mundial. Selecciona una actividad para comenzar.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 440 }}>
        {PAGES.map(page => (
          <Link
            key={page.path}
            to={page.path}
            style={{
              display: 'block',
              padding: '20px 24px',
              borderRadius: 14,
              border: `1px solid ${page.color}30`,
              background: `${page.color}08`,
              textDecoration: 'none',
              color: '#e2e8f0',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{page.label}</div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>{page.desc}</div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 48, fontSize: 12, color: '#334155', textAlign: 'center' }}>
        Tec de Monterrey · Campus Puebla · Departamento de Economía
      </div>
    </div>
  )
}

function BackButton() {
  const location = useLocation()
  if (location.pathname === '/') return null
  return (
    <Link to="/" style={{
      position: 'fixed',
      top: 12,
      left: 12,
      zIndex: 1000,
      background: 'rgba(10,22,40,0.9)',
      border: '1px solid #1e293b',
      borderRadius: 10,
      padding: '8px 14px',
      color: '#94a3b8',
      textDecoration: 'none',
      fontSize: 13,
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600,
      backdropFilter: 'blur(8px)',
    }}>
      ← Inicio
    </Link>
  )
}

export default function App() {
  return (
    <>
      <BackButton />
      <Routes>
        <Route path="/" element={<Landing />} />
        {PAGES.map(page => (
          <Route key={page.path} path={page.path} element={<page.component />} />
        ))}
      </Routes>
    </>
  )
}
