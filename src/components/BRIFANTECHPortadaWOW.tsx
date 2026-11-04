import { useMemo, useState } from "react";
const topics = ["Todo", "Redes", "Ciberseguridad", "Programación", "Sistemas"];
const articles = [{
  category: "Redes",
  level: "Principiante",
  title: "VLAN desde cero: segmenta tu red como un profesional",
  description: "Comprende cómo separar departamentos, reducir dominios de broadcast y organizar una infraestructura.",
  read: "12 min",
  icon: "⌘",
  color: "cyan"
}, {
  category: "Ciberseguridad",
  level: "Intermedio",
  title: "Wireshark: aprende a leer el tráfico de tu red",
  description: "Una guía práctica para interpretar paquetes, protocolos y conversaciones de red.",
  read: "18 min",
  icon: "◈",
  color: "violet"
}, {
  category: "Programación",
  level: "Principiante",
  title: "Git y GitHub: tu primer flujo de trabajo",
  description: "Versiona tus proyectos, trabaja con ramas y publica tu código con confianza.",
  read: "9 min",
  icon: "</>",
  color: "blue"
}, {
  category: "Sistemas",
  level: "Intermedio",
  title: "Windows Server: fundamentos de Active Directory",
  description: "Conoce usuarios, grupos, unidades organizativas y administración centralizada.",
  read: "15 min",
  icon: "▦",
  color: "emerald"
}];
const paths = [{
  number: "01",
  title: "Fundamentos de redes",
  detail: "De direccionamiento IP a VLAN y routing",
  lessons: "8 módulos",
  accent: "from-cyan-400 to-blue-500"
}, {
  number: "02",
  title: "Ciberseguridad esencial",
  detail: "Sistemas, análisis y buenas prácticas",
  lessons: "6 módulos",
  accent: "from-violet-400 to-fuchsia-500"
}, {
  number: "03",
  title: "Desarrollo web",
  detail: "HTML, CSS, JavaScript y Git",
  lessons: "10 módulos",
  accent: "from-blue-400 to-indigo-500"
}];
function Arrow({
  diagonal = false
}: {
  diagonal?: boolean;
}) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}
function Logo() {
  return <a href="#inicio" className="flex items-center gap-3" aria-label="BRIFAN TECH, inicio">
    <span className="relative grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-lg font-black text-cyan-300 shadow-[0_0_28px_rgba(34,211,238,.16)]">B<span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_#a78bfa]" /></span>
    <span className="text-[15px] font-extrabold tracking-[.18em] text-white">BRIFAN<span className="text-cyan-300"> TECH</span><span className="mt-0.5 block text-[9px] font-medium tracking-[.31em] text-slate-500">LEARN · BUILD · SHARE</span></span>
  </a>;
}
export function BRIFANTECHPortadaWOW() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState("Todo");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => articles.filter(article => {
    const topicMatch = activeTopic === "Todo" || article.category === activeTopic;
    const queryMatch = (article.title + " " + article.description + " " + article.category).toLowerCase().includes(query.toLowerCase());
    return topicMatch && queryMatch;
  }), [activeTopic, query]);
  return <main id="inicio" className="min-h-screen overflow-hidden bg-[#070b14] text-slate-100 selection:bg-cyan-300/30">
    <div className="pointer-events-none fixed inset-0 -z-0 opacity-40" aria-hidden="true" style={{
      backgroundImage: "linear-gradient(rgba(148,163,184,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,.045) 1px,transparent 1px)",
      backgroundSize: "64px 64px",
      maskImage: "linear-gradient(to bottom,black,transparent 78%)"
    }} />
    <header className="relative z-20 border-b border-white/[.07] bg-[#070b14]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex" aria-label="Navegación principal">
          <a className="transition hover:text-cyan-300" href="#explorar">Explorar</a><a className="transition hover:text-cyan-300" href="#rutas">Rutas de aprendizaje</a><a className="transition hover:text-cyan-300" href="#comunidad">Comunidad</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex"><a href="#explorar" className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/40 hover:text-white">Iniciar sesión</a><a href="#comunidad" className="rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200">Únete gratis <Arrow diagonal /></a></div>
        <button type="button" className="rounded-lg border border-white/10 px-3 py-2 text-sm md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir menú">{menuOpen ? "Cerrar" : "Menú"}</button>
      </div>
      {menuOpen && <nav className="grid gap-1 border-t border-white/10 px-5 py-4 md:hidden"><a className="rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5" href="#explorar" onClick={() => setMenuOpen(false)}>Explorar</a><a className="rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5" href="#rutas" onClick={() => setMenuOpen(false)}>Rutas de aprendizaje</a><a className="rounded-lg px-3 py-3 text-slate-300 hover:bg-white/5" href="#comunidad" onClick={() => setMenuOpen(false)}>Comunidad</a></nav>}
    </header>

    <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-20 sm:px-8 md:pb-32 md:pt-28 lg:grid-cols-[1.08fr_.92fr]">
      <div className="relative">
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-cyan-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /> El conocimiento conecta</div>
        <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-[-.055em] text-white sm:text-6xl lg:text-[4.65rem]">Aprende tecnología.<br /><span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">Construye el futuro.</span></h1>
        <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">Un espacio para descubrir, aprender y compartir conocimiento sobre redes, programación, sistemas y ciberseguridad. Tu próximo nivel comienza aquí.</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#explorar" className="inline-flex items-center justify-center gap-3 rounded-xl bg-cyan-300 px-7 py-4 text-sm font-extrabold text-slate-950 shadow-[0_12px_50px_rgba(34,211,238,.18)] transition hover:-translate-y-1 hover:bg-cyan-200">Explorar contenido <Arrow /></a><a href="#rutas" className="inline-flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-7 py-4 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[.07]">Ver rutas de aprendizaje <Arrow diagonal /></a></div>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[.08] pt-7 text-xs text-slate-500"><span><b className="mr-2 text-white">01.</b> Aprende a tu ritmo</span><span><b className="mr-2 text-white">02.</b> Comparte lo que sabes</span><span><b className="mr-2 text-white">03.</b> Crece en comunidad</span></div>
      </div>

      <div className="relative mx-auto flex min-h-[390px] w-full max-w-[520px] items-center justify-center sm:min-h-[490px]">
        <div className="absolute h-[78%] w-[78%] rounded-full bg-cyan-500/10 blur-[85px]" />
        <div className="absolute h-[80%] w-[80%] rounded-full border border-cyan-300/10 [transform:rotateX(68deg)_rotateZ(-24deg)]" />
        <div className="absolute h-[64%] w-[64%] rounded-full border border-violet-300/20 [transform:rotateX(68deg)_rotateZ(28deg)]" />
        <div className="absolute h-[48%] w-[48%] rounded-full border border-blue-300/20 [transform:rotateX(68deg)_rotateZ(-55deg)]" />
        <div className="relative grid aspect-square w-[66%] place-items-center rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-[#14263c] via-[#101a30] to-[#17102c] shadow-[0_35px_100px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.15)] [transform:rotate(-8deg)]">
          <div className="absolute inset-3 rounded-[2rem] border border-cyan-200/10" />
          <div className="relative text-center [transform:rotate(8deg)]"><div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-[2rem] border border-cyan-200/30 bg-cyan-300/10 text-5xl font-black text-cyan-200 shadow-[0_0_55px_rgba(34,211,238,.22)]">B<span className="text-violet-300">.</span></div><div className="text-xs font-bold tracking-[.35em] text-slate-400">BRIFAN TECH</div><div className="mt-2 text-[10px] tracking-[.2em] text-cyan-300">EXPLORE · CREATE · CONNECT</div></div>
          <div className="absolute -right-8 top-12 rounded-2xl border border-white/10 bg-[#111b2b]/90 px-4 py-3 shadow-2xl backdrop-blur"><div className="text-[10px] text-slate-500">LEARNING MODE</div><div className="mt-1 text-xs font-bold text-cyan-200">● ACTIVE</div></div>
          <div className="absolute -bottom-7 -left-10 rounded-2xl border border-white/10 bg-[#111b2b]/90 px-4 py-3 shadow-2xl backdrop-blur"><div className="text-[10px] text-slate-500">YOUR NEXT LEVEL</div><div className="mt-1 text-xs font-bold text-white">∞ Possibilities</div></div>
        </div>
        <div className="absolute left-[4%] top-[20%] grid h-12 w-12 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-xl text-cyan-200 shadow-lg">⌘</div><div className="absolute right-[5%] top-[27%] grid h-14 w-14 place-items-center rounded-2xl border border-violet-200/20 bg-violet-300/10 text-2xl text-violet-200 shadow-lg">◈</div><div className="absolute bottom-[13%] right-[13%] grid h-11 w-11 place-items-center rounded-xl border border-blue-200/20 bg-blue-300/10 text-lg text-blue-200">⌁</div>
      </div>
    </section>

    <section className="relative z-10 border-y border-white/[.07] bg-white/[.02]"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:px-8 md:grid-cols-4"><div><div className="text-2xl font-black text-white">01<span className="text-cyan-300">.</span></div><div className="mt-1 text-xs text-slate-500">Aprende desde cero</div></div><div><div className="text-2xl font-black text-white">∞</div><div className="mt-1 text-xs text-slate-500">Conocimiento por descubrir</div></div><div><div className="text-2xl font-black text-white">24/7</div><div className="mt-1 text-xs text-slate-500">Aprende a tu ritmo</div></div><div><div className="text-2xl font-black text-white">100<span className="text-cyan-300">%</span></div><div className="mt-1 text-xs text-slate-500">Enfocado en tecnología</div></div></div></section>

    <section id="explorar" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="text-xs font-bold uppercase tracking-[.25em] text-cyan-300">Biblioteca tecnológica</div><h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Explora. Aprende. Domina.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">Contenido práctico para avanzar desde tus primeros pasos hasta proyectos más complejos.</p></div><div className="relative w-full md:max-w-xs"><label htmlFor="brifan-search" className="sr-only">Buscar contenido</label><input id="brifan-search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar tutoriales, temas..." className="w-full rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 pl-11 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/10" /><span className="absolute left-4 top-3 text-slate-500">⌕</span></div></div>
      <div className="mt-9 flex flex-wrap gap-2">{topics.map(topic => <button key={topic} onClick={() => setActiveTopic(topic)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activeTopic === topic ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-white/[.03] text-slate-400 hover:border-white/25 hover:text-white"}`}>{topic}</button>)}</div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{filtered.map(article => <article key={article.title} className="group flex min-h-[290px] flex-col rounded-2xl border border-white/[.09] bg-gradient-to-b from-white/[.055] to-white/[.015] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_20px_60px_rgba(0,0,0,.25)]"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[.08] text-lg text-cyan-200">{article.icon}</span><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-500">{article.level}</span></div><div className="mt-6 text-[10px] font-bold uppercase tracking-[.18em] text-cyan-300">{article.category}</div><h3 className="mt-3 text-lg font-bold leading-snug text-white">{article.title}</h3><p className="mt-3 flex-1 text-xs leading-6 text-slate-400">{article.description}</p><div className="mt-6 flex items-center justify-between border-t border-white/[.08] pt-4 text-[11px] text-slate-500"><span>{article.read} de lectura</span><a href="#comunidad" aria-label={`Conocer más sobre ${article.title}`} className="font-bold text-cyan-300 transition group-hover:translate-x-1">Leer <Arrow /></a></div></article>)}</div>
      {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center text-sm text-slate-500">No encontramos contenido con esa búsqueda. Prueba con otro término.</div>}
    </section>

    <section id="rutas" className="relative z-10 border-y border-white/[.07] bg-[#0b1220]"><div className="mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="max-w-2xl"><div className="text-xs font-bold uppercase tracking-[.25em] text-violet-300">Tu camino empieza aquí</div><h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">Rutas para construir tu futuro.</h2><p className="mt-4 text-sm leading-7 text-slate-400">Aprende con una dirección clara. Sigue módulos organizados y construye conocimientos paso a paso.</p></div><div className="mt-10 grid gap-4 lg:grid-cols-3">{paths.map(path => <article key={path.number} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.035] p-7 transition hover:border-white/20"><div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${path.accent}`} /><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.2em] text-slate-500">RUTA {path.number}</span><span className="text-xs text-slate-500">{path.lessons}</span></div><h3 className="mt-9 text-xl font-bold text-white">{path.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{path.detail}</p><a href="#explorar" className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-cyan-300">Explorar ruta <Arrow diagonal /></a></article>)}</div></div></section>

    <section id="comunidad" className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8"><div className="relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-gradient-to-br from-[#11283a] via-[#11182d] to-[#211638] px-7 py-14 text-center sm:px-14"><div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" /><div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-violet-400/15 blur-3xl" /><div className="relative mx-auto max-w-2xl"><div className="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">La tecnología se construye en comunidad</div><h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-5xl">Lo que sabes puede impulsar a alguien más.</h2><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300">Comparte tus ideas, documenta lo que aprendes y descubre nuevas perspectivas junto a otras personas apasionadas por la tecnología.</p><a href="#inicio" className="mt-8 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 text-sm font-extrabold text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-100">Forma parte de BRIFAN TECH <Arrow diagonal /></a></div></div></section>

    <footer className="relative z-10 border-t border-white/[.08]"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-9 sm:px-8 md:flex-row md:items-center"><div><Logo /><p className="mt-4 text-xs text-slate-600">Una comunidad para aprender, crear y compartir tecnología.</p></div><div className="flex flex-wrap gap-5 text-xs text-slate-500"><a className="hover:text-cyan-300" href="#explorar">Explorar</a><a className="hover:text-cyan-300" href="#rutas">Aprendizaje</a><a className="hover:text-cyan-300" href="#comunidad">Comunidad</a></div><div className="text-[10px] text-slate-600">© 2026 BRIFAN TECH. Construido para aprender.</div></div></footer>
  </main>;
}