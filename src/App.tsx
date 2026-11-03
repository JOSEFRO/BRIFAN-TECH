import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, BrainCircuit, Code2, Cpu, Database, FileText, Globe2, Layers3, LogOut, Menu, Network, Search, ShieldCheck, Sparkles, Terminal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from './lib/supabase'

const categories = [
  { name: 'Redes y conectividad', icon: Network, tone: 'blue' },
  { name: 'Ciberseguridad', icon: ShieldCheck, tone: 'violet' },
  { name: 'Programación', icon: Code2, tone: 'cyan' },
  { name: 'Inteligencia artificial', icon: BrainCircuit, tone: 'pink' },
  { name: 'Sistemas operativos', icon: Terminal, tone: 'green' },
  { name: 'Bases de datos', icon: Database, tone: 'orange' },
  { name: 'Cloud y DevOps', icon: Layers3, tone: 'blue' },
  { name: 'Hardware y electrónica', icon: Cpu, tone: 'green' },
  { name: 'Soporte técnico', icon: FileText, tone: 'violet' },
  { name: 'Certificaciones y formación', icon: Sparkles, tone: 'pink' },
]
const demoResources = [
  { type: 'GUÍA', title: 'Fundamentos de redes: de cero a tu primera topología', category: 'Redes y conectividad', level: 'Principiante', time: '12 min', icon: Network, color: 'blue' },
  { type: 'TUTORIAL', title: 'Cómo funciona la autenticación moderna en aplicaciones web', category: 'Programación', level: 'Intermedio', time: '18 min', icon: Code2, color: 'violet' },
  { type: 'RECURSO', title: 'Laboratorio práctico: conceptos esenciales de Linux', category: 'Sistemas operativos', level: 'Principiante', time: '25 min', icon: Terminal, color: 'green' },
]

export default function App() {
  const [query, setQuery] = useState('')
  const [liveResources, setLiveResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    if (!supabase) return
    let mounted = true
    void supabase.auth.getSession().then(({ data }) => { if (mounted) setSession(data.session) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => { mounted = false; subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user.id) { setSavedIds([]); return }
    let mounted = true
    void supabase.from('bookmarks').select('article_id').eq('user_id', session.user.id).then(({ data }) => {
      if (mounted) setSavedIds((data ?? []).map((row: { article_id: string }) => row.article_id))
    })
    return () => { mounted = false }
  }, [session?.user.id])

  async function submitAuth() {
    if (!supabase) { setAuthMessage('El servicio de autenticación no está configurado.'); return }
    setAuthBusy(true)
    setAuthMessage('')
    const result = authMode === 'signup'
      ? await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword, options: { data: { display_name: authName.trim() } } })
      : await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword })
    setAuthBusy(false)
    if (result.error) { setAuthMessage(result.error.message); return }
    if (authMode === 'signup') setAuthMessage('Cuenta creada. Si la confirmación por correo está activada, revisa tu bandeja de entrada.')
    else { setAuthOpen(false); setAuthPassword('') }
  }

  async function toggleBookmark(articleId?: string) {
    if (!articleId || !supabase) return
    if (!session) { setAuthMode('signin'); setAuthOpen(true); setAuthMessage('Inicia sesión para guardar publicaciones.'); return }
    const isSaved = savedIds.includes(articleId)
    const result = isSaved
      ? await supabase.from('bookmarks').delete().eq('user_id', session.user.id).eq('article_id', articleId)
      : await supabase.from('bookmarks').insert({ user_id: session.user.id, article_id: articleId })
    if (result.error) { setAuthMessage('No se pudo actualizar el guardado. Inténtalo de nuevo.'); return }
    setSavedIds(current => isSaved ? current.filter(id => id !== articleId) : [...current, articleId])
  }

  useEffect(() => {
    let active = true
    async function loadResources() {
      if (!supabase) { setLoadingResources(false); return }
      const { data, error } = await supabase.from('articles').select('id,title,excerpt,body_md,content_type,difficulty,reading_minutes,categories(name)').eq('status', 'published').order('published_at', { ascending: false }).limit(18)
      if (!active) return
      if (!error && data) setLiveResources(data.map((item: any) => ({ id: item.id, excerpt: item.excerpt, body: item.body_md, type: String(item.content_type ?? 'article').toUpperCase(), title: item.title, category: item.categories?.name ?? 'Tecnología', level: item.difficulty === 'beginner' ? 'Principiante' : item.difficulty === 'advanced' ? 'Avanzado' : item.difficulty === 'all' ? 'Todos' : 'Intermedio', time: (item.reading_minutes ?? 1) + ' min', icon: BookOpen, color: 'blue' })))
      setLoadingResources(false)
    }
    void loadResources()
    return () => { active = false }
  }, [])
  const resources = liveResources.length > 0 ? liveResources : demoResources
  const [active, setActive] = useState('Todo')
  const [menu, setMenu] = useState(false)
  const filtered = useMemo(() => resources.filter((r) =>
    (active === 'Todo' || r.category === active) &&
    (r.title + r.category + r.type).toLowerCase().includes(query.toLowerCase())
  ), [active, query])

  return <div className="min-h-screen overflow-hidden bg-[#080d18] text-slate-100">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
      <a href="#" className="flex items-center gap-3"><span className="brand-mark"><Layers3 size={21}/></span><span className="text-lg font-black tracking-[.16em]">BRIFAN<span className="text-cyan-300">.</span>TECH</span></a>
      <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex"><a className="nav-link active" href="#explorar">Explorar</a><a className="nav-link" href="#categorias">Categorías</a><a className="nav-link" href="#comunidad">Comunidad</a><a className="nav-link" href="#nosotros">Acerca de</a></nav>
      <div className="hidden items-center gap-3 md:flex">{session ? <><span className="text-xs text-slate-400">{session.user.email}</span><button className="btn-ghost" onClick={() => void supabase?.auth.signOut()}><LogOut size={15}/> Salir</button></> : <><button className="btn-ghost" onClick={() => {setAuthMode('signin');setAuthOpen(true);setAuthMessage('')}}>Iniciar sesión</button><button className="btn-primary" onClick={() => {setAuthMode('signup');setAuthOpen(true);setAuthMessage('')}}>Únete gratis <ArrowUpRight size={16}/></button></>}</div>
      <button className="rounded-xl border border-white/10 p-2 md:hidden" onClick={() => setMenu(!menu)} aria-label="Abrir menú">{menu ? <X/> : <Menu/>}</button>
    </header>
    {menu && <div className="relative z-30 mx-5 rounded-2xl border border-white/10 bg-slate-900 p-5 md:hidden"><div className="flex flex-col gap-4 text-sm text-slate-300"><a href="#explorar" onClick={() => setMenu(false)}>Explorar</a><a href="#categorias" onClick={() => setMenu(false)}>Categorías</a><a href="#comunidad" onClick={() => setMenu(false)}>Comunidad</a></div></div>}
    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-28 lg:pt-24">
        <div><div className="eyebrow"><span className="pulse-dot"/> CONOCIMIENTO QUE CONECTA</div><h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">El conocimiento<br/>tecnológico <span className="gradient-text">no tiene límites.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">Aprende, comparte y descubre. Una comunidad para explorar el mundo de la tecnología, desde los fundamentos hasta las ideas que están transformando el futuro.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#explorar" className="btn-primary px-6 py-3.5">Explorar contenido <ArrowRight size={17}/></a><a href="#comunidad" className="btn-secondary px-6 py-3.5">Conoce la comunidad</a></div><div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7 text-xs font-semibold uppercase tracking-[.16em] text-slate-500"><span className="flex items-center gap-2"><BookOpen size={15} className="text-cyan-300"/> Guías y tutoriales</span><span className="flex items-center gap-2"><Globe2 size={15} className="text-cyan-300"/> Comunidad abierta</span><span className="flex items-center gap-2"><Sparkles size={15} className="text-cyan-300"/> Aprende a tu ritmo</span></div></div>
        <div className="hero-visual relative mx-auto w-full max-w-xl"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="visual-core"><div className="core-grid"/><div className="core-icon"><Cpu size={58} strokeWidth={1.2}/></div><span className="core-label">BRIFAN / KNOWLEDGE</span></div><div className="float-card float-card-top"><span className="float-icon cyan"><Network size={18}/></span><div><b>Redes & sistemas</b><small>Conecta ideas</small></div><span className="tiny-status"/></div><div className="float-card float-card-right"><span className="float-icon purple"><ShieldCheck size={18}/></span><div><b>Cyber security</b><small>Protege el futuro</small></div></div><div className="float-card float-card-bottom"><span className="float-icon green"><Code2 size={18}/></span><div><b>Desarrollo</b><small>Construye soluciones</small></div></div><div className="float-chip chip-left">01 — EXPLORE</div><div className="float-chip chip-right">02 — LEARN</div></div>
      </section>
      <section className="signal-section mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="signal-panel">
          <div className="signal-copy"><span className="section-kicker">LIVE / TECH ECOSYSTEM</span><h2>La tecnología está <span className="gradient-text">en movimiento.</span></h2><p>Explora cómo se conectan las ideas: redes, datos, código e inteligencia artificial en un mismo ecosistema.</p><div className="signal-points"><span><i className="signal-dot cyan-dot"/> Redes conectadas</span><span><i className="signal-dot violet-dot"/> Datos en flujo</span><span><i className="signal-dot green-dot"/> Ideas en evolución</span></div></div>
          <div className="data-visual" aria-label="Visualización animada de datos tecnológicos">
            <div className="data-grid"/>
            <svg className="network-svg" viewBox="0 0 520 300" role="img" aria-label="Red de nodos conectados">
              <defs><linearGradient id="netLine" x1="0" x2="1"><stop stopColor="#43d9e8" stopOpacity=".12"/><stop offset="1" stopColor="#a78bfa" stopOpacity=".85"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <g stroke="url(#netLine)" strokeWidth="1.4" fill="none"><path d="M70 150 160 65 260 105 365 48 450 130 350 230 245 190 145 245 70 150"/><path d="M160 65 145 245M260 105 245 190M365 48 350 230M70 150 245 190 450 130M160 65 350 230M260 105 450 130"/></g>
              <g className="network-nodes" filter="url(#glow)"><circle cx="70" cy="150" r="7"/><circle cx="160" cy="65" r="6"/><circle cx="260" cy="105" r="10"/><circle cx="365" cy="48" r="6"/><circle cx="450" cy="130" r="8"/><circle cx="350" cy="230" r="7"/><circle cx="245" cy="190" r="6"/><circle cx="145" cy="245" r="8"/></g>
              <circle className="network-pulse" cx="260" cy="105" r="22"/><circle className="network-pulse delay" cx="450" cy="130" r="18"/>
            </svg>
            <div className="data-widget widget-a"><span>NETWORK TRAFFIC</span><strong>↗ <b>+24.8%</b></strong><div className="mini-bars">{[24,38,30,52,42,68,50,78,62,92,72,100].map((v,i)=><i key={i} style={{height:v+'%'}}/>)}</div></div>
            <div className="data-widget widget-b"><span>DATA FLOW</span><div className="flow-ring"><b>98<span>%</span></b></div><small>Conexiones activas</small></div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.07] bg-white/[.018]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8"><div className="flex items-center gap-4"><span className="stat-icon"><BookOpen size={19}/></span><div><b className="block text-sm">Conocimiento compartido</b><span className="text-xs text-slate-500">Experiencias que ayudan a crecer</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><FileText size={19}/></span><div><b className="block text-sm">Recursos prácticos</b><span className="text-xs text-slate-500">Material para aprender haciendo</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><Globe2 size={19}/></span><div><b className="block text-sm">Comunidad tecnológica</b><span className="text-xs text-slate-500">Distintas áreas, una misma pasión</span></div></div></div></section>
      <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">01 / EXPLORA POR ÁREA</span><h2>Un universo de <span className="gradient-text">posibilidades.</span></h2></div><a href="#explorar" className="text-sm font-semibold text-cyan-300">Ver contenido <ArrowUpRight size={15} className="inline"/></a></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(({name,icon:Icon,tone},i)=><button key={name} onClick={()=>{setActive(name);document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}} className="category-card group text-left"><div className={'category-icon '+tone}><Icon size={22}/></div><div className="mt-7 flex items-end justify-between"><div><span className="mb-2 block text-xs text-slate-500">0{i+1} / ÁREA</span><h3>{name}</h3><span className="mt-2 block text-xs text-slate-500">Explorar contenido</span></div><ArrowUpRight className="text-slate-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300"/></div></button>)}</div></section>
      <section id="explorar" className="border-y border-white/[.07] bg-[#0b1220]/80"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">02 / BIBLIOTECA</span><h2>Descubre algo <span className="gradient-text">nuevo.</span></h2><p className="mt-3 text-sm text-slate-400">Guías, tutoriales y recursos para llevar tus conocimientos más lejos.</p></div></div><div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{['Todo',...categories.map(c=>c.name)].map(item=><button key={item} onClick={()=>setActive(item)} className={'filter-pill '+(active===item?'selected':'')}>{item}</button>)}</div><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contenido..."/></label></div><div className="mt-8 grid gap-5 lg:grid-cols-3">{loadingResources ? <div className="col-span-full py-14 text-center text-sm text-slate-500">Cargando publicaciones...</div> : filtered.map(({id,type,title,category,level,time,icon:Icon,color})=><article key={id ?? title} className="resource-card"><div className={'resource-art '+color}><div className="art-orbit"/><Icon size={42} strokeWidth={1.1}/><span className="resource-type">{type}</span></div><div className="p-5"><span className="text-xs font-semibold text-cyan-300">{category}</span><h3 className="mt-3 min-h-14 text-lg font-bold leading-snug">{title}</h3><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500"><span>{level} · {time}</span><button aria-label={savedIds.includes(id) ? "Quitar de guardados" : "Guardar recurso"} aria-pressed={Boolean(id && savedIds.includes(id))} onClick={() => void toggleBookmark(id)} disabled={!id} className="rounded-lg p-2 hover:bg-white/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"><Bookmark size={16} fill={id && savedIds.includes(id) ? "currentColor" : "none"}/></button></div></div></article>)}{filtered.length===0&&<div className="col-span-full rounded-2xl border border-dashed border-white/15 py-14 text-center text-sm text-slate-500">No encontramos contenido con esos filtros. Prueba otra búsqueda.</div>}</div><p className="mt-5 text-xs text-slate-600">{liveResources.length > 0 ? 'Contenido publicado desde Supabase.' : isSupabaseConfigured ? 'Mostrando recursos de ejemplo: todavía no hay artículos publicados en la biblioteca.' : 'Vista de demostración. Configura Supabase para activar la biblioteca.'}</p></div></section>
      <section id="comunidad" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="community-panel"><div className="relative z-10 max-w-2xl"><span className="section-kicker">03 / CONSTRUYAMOS JUNTOS</span><h2 className="mt-4 text-3xl font-black sm:text-4xl">Tu experiencia también puede <span className="gradient-text">inspirar.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">BRIFAN TECH busca reunir a estudiantes, profesionales y entusiastas para compartir soluciones, documentar aprendizajes y hacer crecer la comunidad tecnológica.</p><button className="btn-primary mt-7" onClick={() => {setAuthMode("signup");setAuthOpen(true);setAuthMessage("")}}>Crear cuenta gratis <ArrowUpRight size={16}/></button></div><div className="community-symbol"><Layers3 size={100} strokeWidth={.7}/></div></div></section>
    </main>
    <footer id="nosotros" className="border-t border-white/[.08]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="brand-mark small"><Layers3 size={16}/></span><b className="tracking-[.14em] text-slate-300">BRIFAN.TECH</b><span>© 2026</span></div><p>Explora. Aprende. Comparte.</p><a href="https://github.com/JOSEFRO/BRIFAN-TECH" target="_blank" rel="noreferrer" className="hover:text-cyan-300">Código en GitHub <ArrowUpRight size={13} className="inline"/></a></div></footer>
    {authOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {if(event.target === event.currentTarget) setAuthOpen(false)}}>
      <section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Cerrar"><X size={18}/></button>
        <span className="section-kicker">BRIFAN / CUENTA</span>
        <h2 id="auth-title">{authMode === 'signup' ? 'Únete a la comunidad' : 'Qué bueno tenerte de vuelta'}</h2>
        <p>{authMode === 'signup' ? 'Crea tu cuenta para guardar recursos y participar.' : 'Accede para guardar tus publicaciones favoritas.'}</p>
        <form onSubmit={(event) => {event.preventDefault(); void submitAuth()}}>
          {authMode === 'signup' && <label>Nombre visible<input value={authName} onChange={event => setAuthName(event.target.value)} required minLength={2} maxLength={60} placeholder="Cómo te conocerá la comunidad"/></label>}
          <label>Correo electrónico<input type="email" value={authEmail} onChange={event => setAuthEmail(event.target.value)} required autoComplete="email" placeholder="tu@correo.com"/></label>
          <label>Contraseña<input type="password" value={authPassword} onChange={event => setAuthPassword(event.target.value)} required minLength={8} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder="Mínimo 8 caracteres"/></label>
          {authMessage && <p className="auth-message" role="status">{authMessage}</p>}
          <button className="btn-primary auth-submit" type="submit" disabled={authBusy}>{authBusy ? 'Procesando…' : authMode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
        </form>
        <button className="auth-switch" onClick={() => {setAuthMode(authMode === 'signup' ? 'signin' : 'signup');setAuthMessage('')}}>{authMode === 'signup' ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crea una cuenta'}</button>
      </section>
    </div>}

  </div>
}
