import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, BrainCircuit, Code2, Cpu, Database, FileText, Globe2, Layers3, Menu, Network, Search, ShieldCheck, Sparkles, Terminal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'

const categories = [
  { name: 'Redes y conectividad', icon: Network, tone: 'blue' },
  { name: 'Ciberseguridad', icon: ShieldCheck, tone: 'violet' },
  { name: 'Programación', icon: Code2, tone: 'cyan' },
  { name: 'Inteligencia artificial', icon: BrainCircuit, tone: 'pink' },
  { name: 'Sistemas operativos', icon: Terminal, tone: 'green' },
  { name: 'Bases de datos', icon: Database, tone: 'orange' },
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
  useEffect(() => {
    let active = true
    async function loadResources() {
      if (!supabase) { setLoadingResources(false); return }
      const { data, error } = await supabase.from('articles').select('id,title,excerpt,content_type,difficulty,reading_minutes,categories(name)').eq('status', 'published').order('published_at', { ascending: false }).limit(18)
      if (!active) return
      if (!error && data) setLiveResources(data.map((item: any) => ({ type: item.content_type.toUpperCase(), title: item.title, category: item.categories?.name ?? 'Tecnología', level: item.difficulty, time: item.reading_minutes + ' min', icon: BookOpen, color: 'blue' })))
      setLoadingResources(false)
    }
    void loadResources()
    return () => { active = false }
  }, [])
  const resources = isSupabaseConfigured ? liveResources : demoResources
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
      <div className="hidden items-center gap-3 md:flex"><button className="btn-ghost">Iniciar sesión</button><button className="btn-primary">Únete gratis <ArrowUpRight size={16}/></button></div>
      <button className="rounded-xl border border-white/10 p-2 md:hidden" onClick={() => setMenu(!menu)} aria-label="Abrir menú">{menu ? <X/> : <Menu/>}</button>
    </header>
    {menu && <div className="relative z-30 mx-5 rounded-2xl border border-white/10 bg-slate-900 p-5 md:hidden"><div className="flex flex-col gap-4 text-sm text-slate-300"><a href="#explorar" onClick={() => setMenu(false)}>Explorar</a><a href="#categorias" onClick={() => setMenu(false)}>Categorías</a><a href="#comunidad" onClick={() => setMenu(false)}>Comunidad</a></div></div>}
    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-28 lg:pt-24">
        <div><div className="eyebrow"><span className="pulse-dot"/> CONOCIMIENTO QUE CONECTA</div><h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">El conocimiento<br/>tecnológico <span className="gradient-text">no tiene límites.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">Aprende, comparte y descubre. Una comunidad para explorar el mundo de la tecnología, desde los fundamentos hasta las ideas que están transformando el futuro.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#explorar" className="btn-primary px-6 py-3.5">Explorar contenido <ArrowRight size={17}/></a><a href="#comunidad" className="btn-secondary px-6 py-3.5">Conoce la comunidad</a></div><div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7 text-xs font-semibold uppercase tracking-[.16em] text-slate-500"><span className="flex items-center gap-2"><BookOpen size={15} className="text-cyan-300"/> Guías y tutoriales</span><span className="flex items-center gap-2"><Globe2 size={15} className="text-cyan-300"/> Comunidad abierta</span><span className="flex items-center gap-2"><Sparkles size={15} className="text-cyan-300"/> Aprende a tu ritmo</span></div></div>
        <div className="hero-visual relative mx-auto w-full max-w-xl"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="visual-core"><div className="core-grid"/><div className="core-icon"><Cpu size={58} strokeWidth={1.2}/></div><span className="core-label">BRIFAN / KNOWLEDGE</span></div><div className="float-card float-card-top"><span className="float-icon cyan"><Network size={18}/></span><div><b>Redes & sistemas</b><small>Conecta ideas</small></div><span className="tiny-status"/></div><div className="float-card float-card-right"><span className="float-icon purple"><ShieldCheck size={18}/></span><div><b>Cyber security</b><small>Protege el futuro</small></div></div><div className="float-card float-card-bottom"><span className="float-icon green"><Code2 size={18}/></span><div><b>Desarrollo</b><small>Construye soluciones</small></div></div><div className="float-chip chip-left">01 — EXPLORE</div><div className="float-chip chip-right">02 — LEARN</div></div>
      </section>
      <section className="border-y border-white/[.07] bg-white/[.018]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8"><div className="flex items-center gap-4"><span className="stat-icon"><BookOpen size={19}/></span><div><b className="block text-sm">Conocimiento compartido</b><span className="text-xs text-slate-500">Experiencias que ayudan a crecer</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><FileText size={19}/></span><div><b className="block text-sm">Recursos prácticos</b><span className="text-xs text-slate-500">Material para aprender haciendo</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><Globe2 size={19}/></span><div><b className="block text-sm">Comunidad tecnológica</b><span className="text-xs text-slate-500">Distintas áreas, una misma pasión</span></div></div></div></section>
      <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">01 / EXPLORA POR ÁREA</span><h2>Un universo de <span className="gradient-text">posibilidades.</span></h2></div><a href="#explorar" className="text-sm font-semibold text-cyan-300">Ver contenido <ArrowUpRight size={15} className="inline"/></a></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(({name,icon:Icon,tone},i)=><button key={name} onClick={()=>{setActive(name);document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}} className="category-card group text-left"><div className={'category-icon '+tone}><Icon size={22}/></div><div className="mt-7 flex items-end justify-between"><div><span className="mb-2 block text-xs text-slate-500">0{i+1} / ÁREA</span><h3>{name}</h3><span className="mt-2 block text-xs text-slate-500">Explorar contenido</span></div><ArrowUpRight className="text-slate-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300"/></div></button>)}</div></section>
      <section id="explorar" className="border-y border-white/[.07] bg-[#0b1220]/80"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">02 / BIBLIOTECA</span><h2>Descubre algo <span className="gradient-text">nuevo.</span></h2><p className="mt-3 text-sm text-slate-400">Guías, tutoriales y recursos para llevar tus conocimientos más lejos.</p></div></div><div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{['Todo',...categories.map(c=>c.name)].map(item=><button key={item} onClick={()=>setActive(item)} className={'filter-pill '+(active===item?'selected':'')}>{item}</button>)}</div><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contenido..."/></label></div><div className="mt-8 grid gap-5 lg:grid-cols-3">{loadingResources ? <div className="col-span-full py-14 text-center text-sm text-slate-500">Cargando publicaciones...</div> : filtered.map(({type,title,category,level,time,icon:Icon,color})=><article key={title} className="resource-card"><div className={'resource-art '+color}><div className="art-orbit"/><Icon size={42} strokeWidth={1.1}/><span className="resource-type">{type}</span></div><div className="p-5"><span className="text-xs font-semibold text-cyan-300">{category}</span><h3 className="mt-3 min-h-14 text-lg font-bold leading-snug">{title}</h3><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500"><span>{level} · {time}</span><button aria-label="Guardar recurso" className="rounded-lg p-2 hover:bg-white/10 hover:text-cyan-300"><Bookmark size={16}/></button></div></div></article>)}{filtered.length===0&&<div className="col-span-full rounded-2xl border border-dashed border-white/15 py-14 text-center text-sm text-slate-500">No encontramos contenido con esos filtros. Prueba otra búsqueda.</div>}</div><p className="mt-5 text-xs text-slate-600">{isSupabaseConfigured ? 'Contenido publicado desde Supabase.' : 'Vista de demostración. Configura Supabase para activar la biblioteca.'}</p></div></section>
      <section id="comunidad" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="community-panel"><div className="relative z-10 max-w-2xl"><span className="section-kicker">03 / CONSTRUYAMOS JUNTOS</span><h2 className="mt-4 text-3xl font-black sm:text-4xl">Tu experiencia también puede <span className="gradient-text">inspirar.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">BRIFAN TECH busca reunir a estudiantes, profesionales y entusiastas para compartir soluciones, documentar aprendizajes y hacer crecer la comunidad tecnológica.</p><button className="btn-primary mt-7">Próximamente <ArrowUpRight size={16}/></button></div><div className="community-symbol"><Layers3 size={100} strokeWidth={.7}/></div></div></section>
    </main>
    <footer id="nosotros" className="border-t border-white/[.08]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="brand-mark small"><Layers3 size={16}/></span><b className="tracking-[.14em] text-slate-300">BRIFAN.TECH</b><span>© 2026</span></div><p>Explora. Aprende. Comparte.</p><a href="https://github.com/JOSEFRO/BRIFAN-TECH" target="_blank" rel="noreferrer" className="hover:text-cyan-300">Código en GitHub <ArrowUpRight size={13} className="inline"/></a></div></footer>
  </div>
}
