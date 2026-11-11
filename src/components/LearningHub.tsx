import { useEffect, useMemo, useState } from 'react'
import { BookOpen, CheckCircle2, ChevronDown, Code2, Download, Network, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'

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

const curatedResources = [
  {
    title: 'Cisco Networking Academy',
    area: 'Redes y conectividad',
    description: 'Cursos gratuitos y autodidactas de fundamentos de redes, Packet Tracer y ciberseguridad.',
    url: 'https://www.cisco.com/site/us/en/learn/training-certifications/training/netacad/index.html',
    label: 'Explorar cursos',
  },
  {
    title: 'NIST NICE',
    area: 'Ciberseguridad',
    description: 'Catálogo de formación gratuita y de bajo costo para desarrollar conocimientos de seguridad.',
    url: 'https://www.nist.gov/itl/applied-cybersecurity/nice/free-and-low-cost-online-cybersecurity-learning-content',
    label: 'Consultar recursos',
  },
  {
    title: 'MDN Web Docs',
    area: 'Desarrollo web',
    description: 'Ruta de aprendizaje y documentación de HTML, CSS y JavaScript.',
    url: 'https://developer.mozilla.org/es/docs/Learn_web_development',
    label: 'Comenzar a aprender',
  },
  {
    title: 'Python — documentación oficial',
    area: 'Programación',
    description: 'Tutorial oficial para aprender los fundamentos del lenguaje Python.',
    url: 'https://docs.python.org/es/3/tutorial/',
    label: 'Abrir tutorial',
  },
  {
    title: 'Microsoft Learn',
    area: 'Sistemas y cloud',
    description: 'Formación oficial sobre Windows, infraestructura, Azure y administración de sistemas.',
    url: 'https://learn.microsoft.com/es-es/training/',
    label: 'Ver formación',
  },
]

const STORAGE_KEY = 'brifan-learning-progress-v1'

export default function LearningHub() {
  const [progress, setProgress] = useState<Record<string, string[]>>({})
  const [expanded, setExpanded] = useState<string | null>(tracks[0].id)
  const [trackSearch, setTrackSearch] = useState('')
  const [areaFilter, setAreaFilter] = useState('Todas')
  const [levelFilter, setLevelFilter] = useState('Todos')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [resourceSearch, setResourceSearch] = useState('')

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

  useEffect(() => {
    try {
      setNotes(JSON.parse(window.localStorage.getItem('brifan-learning-notes-v1') || '{}'))
      setBookmarks(JSON.parse(window.localStorage.getItem('brifan-learning-bookmarks-v1') || '[]'))
    } catch { setNotes({}); setBookmarks([]) }
  }, [])

  useEffect(() => {
    try { window.localStorage.setItem('brifan-learning-notes-v1', JSON.stringify(notes)) } catch { /* local-only notes */ }
  }, [notes])

  useEffect(() => {
    try { window.localStorage.setItem('brifan-learning-bookmarks-v1', JSON.stringify(bookmarks)) } catch { /* local-only bookmarks */ }
  }, [bookmarks])

  const filteredTracks = useMemo(() => tracks.filter(track =>
    (areaFilter === 'Todas' || track.area === areaFilter) &&
    (levelFilter === 'Todos' || track.level === levelFilter) &&
    (track.title + ' ' + track.description + ' ' + track.area).toLocaleLowerCase('es').includes(trackSearch.toLocaleLowerCase('es'))
  ), [areaFilter, levelFilter, trackSearch])

  const visibleResources = useMemo(() => curatedResources.filter(resource =>
    (resource.title + ' ' + resource.description + ' ' + resource.area).toLocaleLowerCase('es').includes(resourceSearch.toLocaleLowerCase('es'))
  ), [resourceSearch])

  const completedCount = useMemo(
    () => tracks.reduce((total, track) => total + (progress[track.id]?.length ?? 0), 0),
    [progress],
  )
  const totalCount = tracks.reduce((total, track) => total + track.lessons.length, 0)

  function exportProgress() {
    const payload = { product: 'BRIFAN TECH', type: 'learning-progress', exportedAt: new Date().toISOString(), tracks: tracks.map(track => ({ id: track.id, title: track.title, completedLessons: progress[track.id] ?? [], totalLessons: track.lessons.length })) }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'brifan-learning-progress.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  function resetProgress() {
    if (!window.confirm('¿Quieres reiniciar el progreso de todas las rutas en este navegador?')) return
    setProgress({})
  }
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
          <div className="learning-progress-actions"><button type="button" onClick={exportProgress} disabled={completedCount === 0}><Download size={14}/> Exportar progreso</button><button type="button" onClick={resetProgress} disabled={completedCount === 0}><RotateCcw size={14}/> Reiniciar</button></div>
        </div>
      </div>
      <div className="learning-discovery">
        <label>Buscar ruta <input value={trackSearch} onChange={event => setTrackSearch(event.target.value)} placeholder="Redes, seguridad, programación…"/></label>
        <label>Área <select value={areaFilter} onChange={event => setAreaFilter(event.target.value)}><option>Todas</option>{Array.from(new Set(tracks.map(track => track.area))).map(area => <option key={area}>{area}</option>)}</select></label>
        <label>Nivel <select value={levelFilter} onChange={event => setLevelFilter(event.target.value)}><option>Todos</option>{Array.from(new Set(tracks.map(track => track.level))).map(level => <option key={level}>{level}</option>)}</select></label>
        <button type="button" onClick={() => { setTrackSearch(''); setAreaFilter('Todas'); setLevelFilter('Todos') }}>Limpiar filtros</button>
      </div>
      <div className="learning-grid">
        {filteredTracks.map(track => {
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
              <button type="button" className="learning-continue" onClick={() => setExpanded(track.id)}>Continuar: {track.lessons.find(lesson => !completed.includes(lesson)) || 'Ruta completada'}</button>
              <button className="learning-expand" onClick={() => setExpanded(isOpen ? null : track.id)} aria-expanded={isOpen}>
                {isOpen ? 'Ocultar módulos' : 'Ver ruta'} <ChevronDown size={15} />
              </button>
              {isOpen && <div className="learning-notes"><label htmlFor={'notes-' + track.id}>Mis notas de esta ruta</label><textarea id={'notes-' + track.id} value={notes[track.id] || ''} onChange={event => setNotes(current => ({ ...current, [track.id]: event.target.value }))} placeholder="Conceptos, comandos y dudas para repasar…"/></div>}
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

      <section className="curated-resources" aria-labelledby="curated-resources-title">
        <div className="curated-resources-heading">
          <span className="section-kicker">RECURSOS VERIFICABLES</span>
          <h3 id="curated-resources-title">Aprende con documentación oficial.</h3>
          <p>Enlaces externos seleccionados para ampliar cada ruta. Algunos cursos pueden requerir una cuenta gratuita o tener condiciones propias.</p>
        </div>
        <label className="resource-search">Buscar recursos <input value={resourceSearch} onChange={event => setResourceSearch(event.target.value)} placeholder="Documentación o cursos…"/></label>
        <div className="curated-resources-grid">
          {visibleResources.map(resource => (
            <article className="curated-resource-card" key={resource.title}>
              <span>{resource.area}</span>
              <h4>{resource.title}</h4>
              <p>{resource.description}</p>
              <div className="resource-actions"><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.label} <span aria-hidden="true">↗</span></a><button type="button" aria-pressed={bookmarks.includes(resource.url)} onClick={() => setBookmarks(current => current.includes(resource.url) ? current.filter(url => url !== resource.url) : [...current, resource.url])}>{bookmarks.includes(resource.url) ? 'Guardado' : 'Guardar'}</button></div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
