import { useEffect, useMemo, useState } from 'react'
import { BookOpen, CheckCircle2, ChevronDown, Code2, Network, ShieldCheck, Sparkles } from 'lucide-react'

type LearningTrack = {
  id: string
  title: string
  area: string
  level: string
  duration: string
  description: string
  icon: typeof Network
  lessons: string[]
}

const tracks: LearningTrack[] = [
  {
    id: 'network-foundations',
    title: 'Fundamentos de redes',
    area: 'Redes y conectividad',
    level: 'Principiante',
    duration: '6 módulos',
    description: 'Comprende direccionamiento IP, switching, VLAN y diagnóstico de conectividad.',
    icon: Network,
    lessons: ['Modelos OSI y TCP/IP', 'IPv4 y máscara de subred', 'Switching y VLAN', 'Troncales y conceptos de routing', 'DHCP, DNS y servicios básicos', 'Diagnóstico con ping y traceroute'],
  },
  {
    id: 'cyber-basics',
    title: 'Ciberseguridad esencial',
    area: 'Ciberseguridad',
    level: 'Principiante',
    duration: '5 módulos',
    description: 'Construye hábitos seguros y aprende los fundamentos de protección digital.',
    icon: ShieldCheck,
    lessons: ['Principios de seguridad', 'Amenazas y vulnerabilidades', 'Autenticación y contraseñas', 'Actualizaciones y copias de seguridad', 'Buenas prácticas de respuesta'],
  },
  {
    id: 'web-development',
    title: 'Desarrollo web inicial',
    area: 'Programación',
    level: 'Principiante',
    duration: '5 módulos',
    description: 'Aprende cómo se estructura, diseña y programa una aplicación web.',
    icon: Code2,
    lessons: ['Estructura HTML semántica', 'Fundamentos de CSS', 'JavaScript y eventos', 'Consumo de APIs', 'Publicación y mantenimiento'],
  },
]

const STORAGE_KEY = 'brifan-learning-progress-v1'

export default function LearningHub() {
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [expanded, setExpanded] = useState<string | null>(tracks[0].id)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setProgress(JSON.parse(saved))
    } catch {
      setProgress({})
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Progress remains available for the current session if storage is unavailable.
    }
  }, [progress])

  const completedCount = useMemo(
    () => tracks.reduce((total, track) => total + (progress[track.id]?.length ?? 0), 0),
    [progress],
  )
  const totalCount = tracks.reduce((total, track) => total + track.lessons.length, 0)

  function toggleLesson(trackId: string, lesson: string) {
    setProgress(current => {
      const completed = current[trackId] ?? []
      return {
        ...current,
        [trackId]: completed.includes(lesson)
          ? completed.filter(item => item !== lesson)
          : [...completed, lesson],
      }
    })
  }

  return (
    <section id="aprendizaje" className="learning-section mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="learning-intro">
        <div>
          <span className="section-kicker">03 / CENTRO DE APRENDIZAJE</span>
          <h2>Avanza con una <span className="gradient-text">ruta clara.</span></h2>
          <p>Elige una especialidad, completa los módulos y lleva tu progreso a tu propio ritmo.</p>
        </div>
        <div className="learning-overview" aria-live="polite">
          <Sparkles size={18} />
          <div><strong>{completedCount}/{totalCount}</strong><span>módulos completados</span></div>
          <div className="learning-progress"><i style={{ width: totalCount ? `${(completedCount / totalCount) * 100}%` : '0%' }} /></div>
        </div>
      </div>
      <div className="learning-grid">
        {tracks.map(track => {
          const Icon = track.icon
          const completed = progress[track.id] ?? []
          const isOpen = expanded === track.id
          const percent = Math.round((completed.length / track.lessons.length) * 100)
          return (
            <article className={`learning-card ${isOpen ? 'is-expanded' : ''}`} key={track.id}>
              <div className="learning-card-top">
                <span className="learning-icon"><Icon size={22} /></span>
                <span className="learning-level">{track.level}</span>
              </div>
              <span className="learning-area">{track.area} · {track.duration}</span>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
              <div className="learning-card-progress"><span>{completed.length} de {track.lessons.length} módulos</span><b>{percent}%</b></div>
              <div className="learning-bar"><i style={{ width: `${percent}%` }} /></div>
              <button className="learning-expand" onClick={() => setExpanded(isOpen ? null : track.id)} aria-expanded={isOpen}>
                {isOpen ? 'Ocultar módulos' : 'Ver ruta'} <ChevronDown size={15} />
              </button>
              {isOpen && <ol className="learning-lessons">
                {track.lessons.map((lesson, index) => {
                  const done = completed.includes(lesson)
                  return <li key={lesson}>
                    <button onClick={() => toggleLesson(track.id, lesson)} className={done ? 'lesson-done' : ''} aria-pressed={done}>
                      <span className="lesson-number">{done ? <CheckCircle2 size={17} /> : String(index + 1).padStart(2, '0')}</span>
                      <span>{lesson}</span>
                      <span className="lesson-check">{done ? 'Completado' : 'Marcar'}</span>
                    </button>
                  </li>
                })}
              </ol>}
            </article>
          )
        })}
      </div>
      <p className="learning-note"><BookOpen size={14} /> El progreso se guarda en este navegador. No requiere crear tablas nuevas ni modificar tu cuenta.</p>
    </section>
  )
}
