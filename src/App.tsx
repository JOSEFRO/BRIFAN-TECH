import Header from './components/Header'
import WelcomeExperience from './components/WelcomeExperience'
import LearningHub from './components/LearningHub'
import CommunityHub from './components/CommunityHub'
import GuideMarkdown from './components/GuideMarkdown'
import { learningGuides } from './data/learningGuides'
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, BrainCircuit, Code2, Cpu, Database, FileText, Globe2, Layers3, Network, Search, ShieldCheck, Sparkles, Terminal, X } from 'lucide-react'
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

const categoryVisuals: Record<string, string> = {
  'Redes y conectividad': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85',
  'Ciberseguridad': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=85',
  'Programación': 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85',
  'Inteligencia artificial': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85',
  'Sistemas operativos': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85',
  'Bases de datos': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=85',
  'Cloud y DevOps': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85',
  'Hardware y electrónica': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85',
  'Soporte técnico': 'https://images.unsplash.com/photo-1581092918056-0c4c3ffd7d5a?auto=format&fit=crop&w=1000&q=85',
  'Certificaciones y formación': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85',
}
const demoResources = learningGuides


function mapArticleToResource(item: any) {
  const rawBody = item.body_md ?? ''
  const attachmentMatch = rawBody.match(/<!--BRIFAN_ATTACHMENTS:(.*?)-->/s)
  let attachments: Array<{ path: string; name: string; type: string }> = []
  try {
    if (attachmentMatch) attachments = JSON.parse(attachmentMatch[1])
  } catch {
    attachments = []
  }
  const cleanBody = attachmentMatch ? rawBody.slice(0, attachmentMatch.index).trim() : rawBody.trim()

  return {
    id: item.id,
    excerpt: item.excerpt,
    body: cleanBody,
    attachments,
    type: String(item.content_type ?? 'article').toUpperCase(),
    title: item.title,
    category: item.categories?.name ?? 'Tecnología',
    image: categoryVisuals[item.categories?.name ?? ''] ?? categoryVisuals['Programación'],
    level: item.difficulty === 'beginner' ? 'Principiante' : item.difficulty === 'advanced' ? 'Avanzado' : item.difficulty === 'all' ? 'Todos' : 'Intermedio',
    time: (item.reading_minutes ?? 1) + ' min',
    icon: BookOpen,
    color: 'blue',
  }
}

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
  const [panoramaMode, setPanoramaMode] = useState<'panorama' | 'network'>('panorama')
  const [selectedResource, setSelectedResource] = useState<any | null>(null)
  const [publishOpen, setPublishOpen] = useState(false)
  const [publishTitle, setPublishTitle] = useState('')
  const [publishCategory, setPublishCategory] = useState(categories[0].name)
  const [publishType, setPublishType] = useState('guide')
  const [publishLevel, setPublishLevel] = useState('beginner')
  const [publishExcerpt, setPublishExcerpt] = useState('')
  const [publishBody, setPublishBody] = useState('')
  const [publishMessage, setPublishMessage] = useState('')
  const [publishBusy, setPublishBusy] = useState(false)
  const [publishFiles, setPublishFiles] = useState<File[]>([])
  const [readerAttachments, setReaderAttachments] = useState<Array<{ name: string; type: string; url: string }>>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminOpen, setAdminOpen] = useState(false)
  const [pendingArticles, setPendingArticles] = useState<any[]>([])
  const [adminMessage, setAdminMessage] = useState('')
  const [readerComments, setReaderComments] = useState<any[]>([])
  const [commentDraft, setCommentDraft] = useState('')
  const [commentBusy, setCommentBusy] = useState(false)
  const [commentMessage, setCommentMessage] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileBusy, setProfileBusy] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState('')
  const [profileForm, setProfileForm] = useState({ display_name: '', username: '', bio: '', website: '' })

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
    try {
      const result = authMode === 'signup'
        ? await supabase.auth.signUp({ email: authEmail.trim(), password: authPassword, options: { data: { display_name: authName.trim() } } })
        : await supabase.auth.signInWithPassword({ email: authEmail.trim(), password: authPassword })
      if (result.error) { setAuthMessage(result.error.message); return }
      if (authMode === 'signup') {
        setAuthMessage(result.data.session
          ? 'Tu cuenta está lista. Ya puedes participar en BRIFAN TECH.'
          : 'Cuenta creada. Revisa tu correo para confirmar el registro.')
      } else {
        setAuthOpen(false)
        setAuthPassword('')
      }
    } catch {
      setAuthMessage('No fue posible conectar con el servicio. Comprueba tu conexión e inténtalo de nuevo.')
    } finally {
      setAuthBusy(false)
    }
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
    async function loadComments() {
      setReaderComments([])
      setCommentMessage('')
      if (!supabase || !selectedResource?.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(selectedResource.id))) return
      const { data, error } = await supabase.from('comments')
        .select('id,body,created_at,author_id,profiles(display_name,username)')
        .eq('article_id', selectedResource.id).eq('is_hidden', false)
        .order('created_at', { ascending: true }).limit(100)
      if (!active) return
      if (error) setCommentMessage('No fue posible cargar los comentarios.')
      else setReaderComments(data ?? [])
    }
    void loadComments()
    return () => { active = false }
  }, [selectedResource?.id])

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !session || !selectedResource?.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(selectedResource.id))) {
      setAuthMode('signin'); setAuthOpen(true)
      setAuthMessage('Inicia sesión para participar en la conversación.')
      return
    }
    const body = commentDraft.trim()
    if (!body || body.length > 3000) return
    setCommentBusy(true); setCommentMessage('')
    const { error } = await supabase.from('comments').insert({ article_id: selectedResource.id, author_id: session.user.id, body })
    if (error) setCommentMessage('No se pudo publicar el comentario. Comprueba tu sesión e inténtalo de nuevo.')
    else {
      setCommentDraft('')
      const { data, error: refreshError } = await supabase.from('comments')
        .select('id,body,created_at,author_id,profiles(display_name,username)')
        .eq('article_id', selectedResource.id).eq('is_hidden', false)
        .order('created_at', { ascending: true }).limit(100)
      if (!refreshError) setReaderComments(data ?? [])
      setCommentMessage('Comentario publicado.')
    }
    setCommentBusy(false)
  }

  async function openProfile() {
    if (!session || !supabase) {
      setAuthMode('signin'); setAuthOpen(true)
      setAuthMessage('Inicia sesión para editar tu perfil.')
      return
    }
    setProfileOpen(true); setProfileBusy(true); setProfileMessage('')
    const { data, error } = await supabase.from('profiles')
      .select('display_name,username,bio,website').eq('id', session.user.id).maybeSingle()
    if (error) setProfileMessage('No se pudo cargar tu perfil. Inténtalo de nuevo.')
    else setProfileForm({
      display_name: data?.display_name ?? String(session.user.user_metadata?.display_name ?? ''),
      username: data?.username ?? '', bio: data?.bio ?? '', website: data?.website ?? '',
    })
    setProfileBusy(false)
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !session) return
    const username = profileForm.username.trim().toLowerCase()
    if (username && !/^[a-z0-9_]{3,24}$/.test(username)) {
      setProfileMessage('El usuario debe tener entre 3 y 24 caracteres: letras, números o guion bajo.')
      return
    }
    const website = profileForm.website.trim()
    if (website) {
      try { new URL(website) } catch {
        setProfileMessage('Introduce una dirección web válida, incluyendo https://.')
        return
      }
    }
    setProfileSaving(true); setProfileMessage('')
    const { data, error } = await supabase.from('profiles').update({
      display_name: profileForm.display_name.trim() || null,
      username: username || null, bio: profileForm.bio.trim(), website: website || null,
    }).eq('id', session.user.id).select('id').maybeSingle()
    if (error || !data) setProfileMessage(error?.code === '23505' ? 'Ese nombre de usuario ya está ocupado.' : 'No se pudo guardar el perfil. Comprueba los datos e inténtalo de nuevo.')
    else setProfileMessage('Perfil actualizado correctamente.')
    setProfileSaving(false)
  }


  useEffect(() => {
    let active = true
    async function loadReaderAttachments() {
      setReaderAttachments([])
      if (!selectedResource?.attachments?.length || !supabase) return
      const signed = await Promise.all(selectedResource.attachments.map(async (file: { path: string; name: string; type: string }) => {
        const { data } = await supabase!.storage.from('brifan-articles').createSignedUrl(file.path, 3600)
        return data?.signedUrl ? { name: file.name, type: file.type, url: data.signedUrl } : null
      }))
      if (active) setReaderAttachments(signed.filter(Boolean) as Array<{ name: string; type: string; url: string }>)
    }
    void loadReaderAttachments()
    return () => { active = false }
  }, [selectedResource])

  useEffect(() => {
    let active = true
    async function loadAdminAccess() {
      setIsAdmin(false)
      if (!supabase || !session?.user.id) return
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle()
      if (active) setIsAdmin(data?.role === 'admin')
    }
    void loadAdminAccess()
    return () => { active = false }
  }, [session?.user.id])

  async function loadPendingArticles() {
    if (!supabase || !isAdmin) return
    const { data, error } = await supabase.from('articles').select('id,title,excerpt,created_at,author_id,categories(name)').eq('status','pending').order('created_at',{ascending:true})
    if (error) { setAdminMessage(error.message); return }
    setPendingArticles(data ?? [])
    setAdminMessage('')
  }

  async function moderateArticle(articleId: string, status: 'published' | 'rejected') {
    if (!supabase || !isAdmin) return
    const { error } = await supabase.from('articles').update({ status, ...(status === 'published' ? { published_at: new Date().toISOString() } : {}) }).eq('id', articleId)
    if (error) { setAdminMessage(error.message); return }
    setAdminMessage(status === 'published' ? 'Publicación aprobada.' : 'Publicación rechazada.')
    await loadPendingArticles()
    if (status === 'published') {
      const { data } = await supabase.from('articles').select('id,title,excerpt,body_md,content_type,difficulty,reading_minutes,categories(name)').eq('status','published').order('published_at',{ascending:false}).limit(18)
      if (data) setLiveResources(data.map(mapArticleToResource))
    }
  }

  async function submitArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !session) {
      setPublishOpen(false)
      setAuthMode('signin')
      setAuthOpen(true)
      setAuthMessage('Inicia sesión para publicar contenido en BRIFAN TECH.')
      return
    }
    setPublishBusy(true)
    setPublishMessage('')
    try {
      const { data: category, error: categoryError } = await supabase.from('categories').select('id').eq('name', publishCategory).eq('is_active', true).single()
      if (categoryError || !category) throw new Error('No se encontró la categoría seleccionada.')
      const slugBase = publishTitle.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 140)
      const slug = slugBase + '-' + Date.now().toString(36)
      const result = await supabase.from('articles').insert({
        author_id: session.user.id,
        category_id: category.id,
        title: publishTitle.trim(),
        slug,
        excerpt: publishExcerpt.trim(),
        body_md: publishBody.trim(),
        content_type: publishType,
        difficulty: publishLevel,
        status: 'pending',
        reading_minutes: Math.max(1, Math.ceil(publishBody.trim().split(/\s+/).length / 180)),
      }).select('id').single()
      if (result.error || !result.data) throw result.error ?? new Error('No se pudo crear la publicación.')
      const uploaded: Array<{ path: string; name: string; type: string }> = []
      try {
        for (const file of publishFiles) {
          if (file.size > 50 * 1024 * 1024) throw new Error('El archivo "' + file.name + '" supera el límite de 50 MB.')
          const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100)
          const path = session.user.id + '/' + result.data.id + '/' + crypto.randomUUID() + '-' + safeName
          const { error: uploadError } = await supabase.storage.from('brifan-articles').upload(path, file, { contentType: file.type, upsert: false })
          if (uploadError) throw uploadError
          uploaded.push({ path, name: file.name, type: file.type })
        }
        if (uploaded.length) {
          const attachmentBlock = '\n\n<!--BRIFAN_ATTACHMENTS:' + JSON.stringify(uploaded) + '-->'
          const { error: updateError } = await supabase.from('articles').update({ body_md: publishBody.trim() + attachmentBlock }).eq('id', result.data.id)
          if (updateError) throw updateError
        }
      } catch (uploadFailure) {
        if (uploaded.length) await supabase.storage.from('brifan-articles').remove(uploaded.map(file => file.path))
        await supabase.from('articles').delete().eq('id', result.data.id).eq('author_id', session.user.id)
        throw uploadFailure
      }
      setPublishMessage('¡Enviado! Tu publicación y sus archivos quedaron pendientes de revisión. Aparecerán en la biblioteca cuando se aprueben.')
      setPublishTitle('')
      setPublishExcerpt('')
      setPublishBody('')
      setPublishFiles([])
    } catch (error: any) {
      setPublishMessage(error?.message || 'No se pudo enviar la publicación. Inténtalo de nuevo.')
    } finally {
      setPublishBusy(false)
    }
  }

  useEffect(() => {
    let active = true
    async function loadResources() {
      if (!supabase) { setLoadingResources(false); return }
      const { data, error } = await supabase.from('articles').select('id,title,excerpt,body_md,content_type,difficulty,reading_minutes,categories(name)').eq('status', 'published').order('published_at', { ascending: false }).limit(18)
      if (!active) return
      if (!error && data) setLiveResources(data.map(mapArticleToResource))
      setLoadingResources(false)
    }
    void loadResources()
    return () => { active = false }
  }, [])
  const resources = liveResources.length > 0 ? liveResources : demoResources
  const [active, setActive] = useState('Todo')
    const filtered = useMemo(() => resources.filter((r) =>
    (active === 'Todo' || r.category === active) &&
    (r.title + ' ' + r.category + ' ' + r.type + ' ' + (r.excerpt ?? '') + ' ' + (r.body ?? '')).toLowerCase().includes(query.trim().toLowerCase())
  ), [resources, active, query])

  return <div className="min-h-screen overflow-hidden bg-[#080d18] text-slate-100">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <WelcomeExperience />
    <Header
      session={session}
      isAdmin={isAdmin}
      onProfile={() => void openProfile()}
      onPublish={() => { setPublishMessage(''); setPublishOpen(true) }}
      onAdmin={() => { setAdminOpen(true); setAdminMessage(''); void loadPendingArticles() }}
      onSignIn={() => { setAuthMode('signin'); setAuthOpen(true); setAuthMessage('') }}
      onSignUp={() => { setAuthMode('signup'); setAuthOpen(true); setAuthMessage('') }}
      onSignOut={() => { void supabase?.auth.signOut() }}
    />
    <main className="relative z-10">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:pb-28 lg:pt-24">
        <div><div className="eyebrow"><span className="pulse-dot"/> PLATAFORMA DE APRENDIZAJE TECNOLÓGICO</div><h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">El conocimiento<br/>tecnológico <span className="gradient-text">no tiene límites.</span></h1><p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">Aprende, comparte y descubre. Una comunidad para explorar el mundo de la tecnología, desde los fundamentos hasta las ideas que están transformando el futuro.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#explorar" className="btn-primary px-6 py-3.5">Explorar contenido <ArrowRight size={17}/></a><a href="#comunidad" className="btn-secondary px-6 py-3.5">Conoce la comunidad</a></div><div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-7 text-xs font-semibold uppercase tracking-[.16em] text-slate-500"><span className="flex items-center gap-2"><BookOpen size={15} className="text-cyan-300"/> Guías y tutoriales</span><span className="flex items-center gap-2"><Globe2 size={15} className="text-cyan-300"/> Comunidad abierta</span><span className="flex items-center gap-2"><Sparkles size={15} className="text-cyan-300"/> Aprende a tu ritmo</span></div></div>
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
      <section id="panorama" className="panorama-section mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="panorama-heading"><div><span className="section-kicker">INTERACTIVE / 3D WORLD</span><h2>Explora la tecnología <span className="gradient-text">en otra dimensión.</span></h2><p>Un recorrido visual por las áreas que mueven el universo digital. Cambia la vista y descubre cada zona.</p></div><div className="panorama-switch" role="group" aria-label="Cambiar visualización"><button className={panoramaMode === 'panorama' ? 'chosen' : ''} onClick={() => setPanoramaMode('panorama')}>Panorama 3D</button><button className={panoramaMode === 'network' ? 'chosen' : ''} onClick={() => setPanoramaMode('network')}>Red conectada</button></div></div>
        <div className={'panorama-stage '+(panoramaMode === 'network' ? 'network-mode' : '')}>
          <div className="panorama-sky"/><div className="panorama-horizon"/>
          <div className="panorama-world" aria-label="Escena tecnológica tridimensional interactiva">
            <div className="world-ring ring-one"/><div className="world-ring ring-two"/><div className="world-ring ring-three"/>
            <div className="world-platform platform-back"/><div className="world-platform platform-mid"/><div className="world-platform platform-front"/>
            <div className="world-tower tower-one"><i/><i/><i/><span>AI / CORE</span></div>
            <div className="world-tower tower-two"><i/><i/><i/><span>DATA</span></div>
            <div className="world-tower tower-three"><i/><i/><i/><span>CYBER</span></div>
            <div className="world-cube cube-one"><b/></div><div className="world-cube cube-two"><b/></div><div className="world-cube cube-three"><b/></div>
            <div className="world-beam beam-one"/><div className="world-beam beam-two"/><div className="world-beam beam-three"/>
            <div className="world-node node-one"/><div className="world-node node-two"/><div className="world-node node-three"/><div className="world-node node-four"/>
            <div className="world-center"><div className="center-orbit"/><Layers3 size={42}/><b>BRIFAN</b><small>TECH ECOSYSTEM</small></div>
          </div>
          <div className="panorama-label label-top"><span className="live-indicator"/> DIGITAL UNIVERSE <small>REAL-TIME EXPERIENCE</small></div>
          <button className="hotspot hotspot-network" onClick={() => {setActive('Redes y conectividad');document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}}><Network size={15}/><span>Redes y conectividad</span><i/></button>
          <button className="hotspot hotspot-ai" onClick={() => {setActive('Inteligencia artificial');document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}}><BrainCircuit size={15}/><span>Inteligencia artificial</span><i/></button>
          <button className="hotspot hotspot-security" onClick={() => {setActive('Ciberseguridad');document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}}><ShieldCheck size={15}/><span>Ciberseguridad</span><i/></button>
          <div className="panorama-caption"><b>{panoramaMode === 'panorama' ? '01 / PANORAMA INMERSIVO' : '02 / MAPA DE CONEXIONES'}</b><span>{panoramaMode === 'panorama' ? 'Arquitectura digital · Profundidad 3D · Movimiento ambiental' : 'Nodos activos · Rutas de datos · Ecosistema conectado'}</span></div>
          <div className="panorama-coordinates">BRIFAN TECH <span>•</span> 3D EXPERIENCE <span>•</span> 2026</div>
        </div>
      </section>
      <section className="border-y border-white/[.07] bg-white/[.018]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8"><div className="flex items-center gap-4"><span className="stat-icon"><BookOpen size={19}/></span><div><b className="block text-sm">Conocimiento compartido</b><span className="text-xs text-slate-500">Experiencias que ayudan a crecer</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><FileText size={19}/></span><div><b className="block text-sm">Recursos prácticos</b><span className="text-xs text-slate-500">Material para aprender haciendo</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><Globe2 size={19}/></span><div><b className="block text-sm">Comunidad tecnológica</b><span className="text-xs text-slate-500">Distintas áreas, una misma pasión</span></div></div></div></section>
      <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">01 / EXPLORA POR ÁREA</span><h2>Un universo de <span className="gradient-text">posibilidades.</span></h2></div><a href="#explorar" className="text-sm font-semibold text-cyan-300">Ver contenido <ArrowUpRight size={15} className="inline"/></a></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(({name,icon:Icon,tone},i)=><button key={name} onClick={()=>{setActive(name);document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}} className="category-card group text-left"><div className={'category-icon '+tone}><Icon size={22}/></div><div className="mt-7 flex items-end justify-between"><div><span className="mb-2 block text-xs text-slate-500">0{i+1} / ÁREA</span><h3>{name}</h3><span className="mt-2 block text-xs text-slate-500">Explorar contenido</span></div><ArrowUpRight className="text-slate-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300"/></div></button>)}</div></section>
      <LearningHub />
      <section id="explorar" className="border-y border-white/[.07] bg-[#0b1220]/80"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">02 / BIBLIOTECA</span><h2>Descubre algo <span className="gradient-text">nuevo.</span></h2><p className="mt-3 text-sm text-slate-400">Guías, tutoriales y recursos para llevar tus conocimientos más lejos.</p></div></div><div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{['Todo',...categories.map(c=>c.name)].map(item=><button key={item} onClick={()=>setActive(item)} className={'filter-pill '+(active===item?'selected':'')}>{item}</button>)}</div><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contenido..."/></label></div><div className="mt-8 grid gap-5 lg:grid-cols-3">{loadingResources ? <div className="col-span-full py-14 text-center text-sm text-slate-500">Cargando publicaciones...</div> : filtered.map(({id,type,title,category,level,time,color,image,excerpt})=><article key={id ?? title} className="resource-card"><div className={'resource-art '+color} style={{backgroundImage: `linear-gradient(180deg,rgba(5,12,23,.12),rgba(5,12,23,.82)),url(${image ?? categoryVisuals[category] ?? categoryVisuals['Programación']})`}}><div className="art-orbit"/><span className="resource-type">{type}</span><span className="resource-image-caption">{category}</span></div><div className="p-5"><span className="text-xs font-semibold text-cyan-300">{category}</span><h3 className="mt-3 min-h-14 text-lg font-bold leading-snug">{title}</h3><p className="mt-2 min-h-10 text-xs leading-6 text-slate-400">{excerpt ?? "Abre este recurso para consultar su contenido."}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500"><span>{level} · {time}</span><div className="flex items-center gap-2"><button onClick={() => setSelectedResource(resources.find((item: any) => item.id === id || item.title === title))} className="rounded-lg px-3 py-2 font-semibold text-cyan-300 hover:bg-cyan-300/10">Leer guía <ArrowUpRight size={14} className="inline"/></button><button aria-label={savedIds.includes(id) ? "Quitar de guardados" : "Guardar recurso"} aria-pressed={Boolean(id && savedIds.includes(id))} onClick={() => void toggleBookmark(id)} disabled={!id} className="rounded-lg p-2 hover:bg-white/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"><Bookmark size={16} fill={id && savedIds.includes(id) ? "currentColor" : "none"}/></button></div></div></div></article>)}{filtered.length===0&&<div className="col-span-full rounded-2xl border border-dashed border-white/15 py-14 text-center text-sm text-slate-500">No encontramos contenido con esos filtros. Prueba otra búsqueda.</div>}</div><p className="mt-5 text-xs text-slate-600">{liveResources.length > 0 ? 'Contenido publicado desde Supabase.' : isSupabaseConfigured ? 'Mostrando recursos de ejemplo: todavía no hay artículos publicados en la biblioteca.' : 'Vista de demostración. Configura Supabase para activar la biblioteca.'}</p></div></section>
      <CommunityHub isSignedIn={Boolean(session)} onJoin={() => { setAuthMode("signup"); setAuthOpen(true); setAuthMessage("") }} onPublish={() => { setPublishMessage(""); setPublishOpen(true) }} onProfile={() => void openProfile()} />
    </main>
    <footer id="nosotros" className="border-t border-white/[.08]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="brand-mark small"><Layers3 size={16}/></span><b className="tracking-[.14em] text-slate-300">BRIFAN.TECH</b><span>© 2026</span></div><p>Explora. Aprende. Comparte.</p><a href="https://github.com/JOSEFRO/BRIFAN-TECH" target="_blank" rel="noreferrer" className="hover:text-cyan-300">Código en GitHub <ArrowUpRight size={13} className="inline"/></a></div></footer>
    {adminOpen && isAdmin && <div className="modal-backdrop resource-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setAdminOpen(false)}}>
      <section className="resource-reader publish-reader" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <button className="modal-close" onClick={()=>setAdminOpen(false)} aria-label="Cerrar"><X size={18}/></button>
        <span className="section-kicker">BRIFAN / CEO CONTROL</span><h2 id="admin-title">Administración de publicaciones</h2>
        <p className="reader-excerpt">Revisa los aportes de la comunidad antes de publicarlos.</p>
        {adminMessage && <p className="auth-message" role="status">{adminMessage}</p>}
        {pendingArticles.length===0 ? <p className="py-8 text-sm text-slate-400">No hay publicaciones pendientes de revisión.</p> : <div className="grid gap-3">{pendingArticles.map(article=><article key={article.id} className="rounded-xl border border-white/10 bg-white/[.03] p-4"><span className="text-xs text-cyan-300">{article.categories?.name ?? 'Tecnología'}</span><h3 className="mt-2 font-bold text-white">{article.title}</h3><p className="mt-2 text-sm text-slate-400">{article.excerpt}</p><div className="mt-4 flex flex-wrap gap-2"><button className="btn-primary" onClick={()=>void moderateArticle(article.id,'published')}>Aprobar y publicar</button><button className="btn-secondary" onClick={()=>void moderateArticle(article.id,'rejected')}>Rechazar</button></div></article>)}</div>}
        <button className="btn-secondary mt-5" onClick={()=>void loadPendingArticles()}>Actualizar lista</button>
      </section>
    </div>}
    {publishOpen && <div className="modal-backdrop resource-backdrop" role="presentation" onMouseDown={(event) => {if(event.target === event.currentTarget && !publishBusy) setPublishOpen(false)}}>
      <section className="resource-reader publish-reader" role="dialog" aria-modal="true" aria-labelledby="publish-title">
        <button className="modal-close" onClick={() => setPublishOpen(false)} aria-label="Cerrar" disabled={publishBusy}><X size={18}/></button>
        <span className="section-kicker">BRIFAN / CONTRIBUCIONES</span>
        <h2 id="publish-title">Comparte tu conocimiento.</h2>
        <p className="reader-excerpt">Crea una guía, tutorial o recurso. Tu contenido se enviará a revisión antes de aparecer públicamente en la biblioteca.</p>
        <form className="publish-form" onSubmit={submitArticle}>
          <label>Título<input value={publishTitle} onChange={e => setPublishTitle(e.target.value)} minLength={8} maxLength={180} required placeholder="Ej. Configuración básica de VLAN"/></label>
          <div className="publish-fields">
            <label>Categoría<select value={publishCategory} onChange={e => setPublishCategory(e.target.value)}>{categories.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}</select></label>
            <label>Tipo<select value={publishType} onChange={e => setPublishType(e.target.value)}><option value="guide">Guía</option><option value="tutorial">Tutorial</option><option value="article">Artículo</option><option value="resource">Recurso</option><option value="news">Noticia</option><option value="snippet">Fragmento</option></select></label>
            <label>Nivel<select value={publishLevel} onChange={e => setPublishLevel(e.target.value)}><option value="beginner">Principiante</option><option value="intermediate">Intermedio</option><option value="advanced">Avanzado</option><option value="all">Todos</option></select></label>
          </div>
          <label>Resumen<textarea value={publishExcerpt} onChange={e => setPublishExcerpt(e.target.value)} maxLength={400} required rows={2} placeholder="Explica brevemente qué aprenderá el lector."/></label>
          <label>Contenido<textarea value={publishBody} onChange={e => setPublishBody(e.target.value)} minLength={40} required rows={10} placeholder="Escribe aquí tu guía. Puedes separar los temas con títulos y párrafos."/></label>
          <label>Imágenes y archivos<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,text/plain,text/markdown,text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/zip" onChange={event => { const incoming = Array.from(event.target.files ?? []); setPublishFiles(current => [...current, ...incoming].slice(0, 8)); event.target.value = '' }} /></label>
          <p className="upload-help">Hasta 8 archivos por publicación · máximo 50 MB por archivo. Imágenes, PDF, Office, CSV, texto y ZIP.</p>
          {publishFiles.length > 0 && <ul className="upload-list">{publishFiles.map((file, index) => <li key={file.name + file.lastModified + index}><span>{file.name} <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span><button type="button" onClick={() => setPublishFiles(current => current.filter((_, i) => i !== index))}>Quitar</button></li>)}</ul>}
          {publishMessage && <p className="auth-message" role="status">{publishMessage}</p>}
          <button className="btn-primary auth-submit" type="submit" disabled={publishBusy}>{publishBusy ? 'Enviando…' : 'Enviar a revisión'}</button>
        </form>
      </section>
    </div>}
    {selectedResource && <div className="modal-backdrop resource-backdrop" role="presentation" onMouseDown={(event) => {if(event.target === event.currentTarget) setSelectedResource(null)}}>
      <section className="resource-reader" role="dialog" aria-modal="true" aria-labelledby="resource-reader-title">
        <button className="modal-close" onClick={() => setSelectedResource(null)} aria-label="Cerrar guía"><X size={18}/></button>
        <span className="section-kicker">{selectedResource.type ?? 'RECURSO'} / {selectedResource.category}</span>
        <div className="guide-cover-image" style={{ backgroundImage: `linear-gradient(180deg,rgba(4,10,20,.05),rgba(4,10,20,.78)),url(${selectedResource.image ?? categoryVisuals[selectedResource.category] ?? categoryVisuals['Programación']})` }} role="img" aria-label={`Imagen ilustrativa: ${selectedResource.category}`}>
          <span>{selectedResource.category}</span>
        </div>
        <h2 id="resource-reader-title">{selectedResource.title}</h2>
        <div className="reader-meta"><span>{selectedResource.level}</span><span>{selectedResource.time}</span></div>
        {selectedResource.excerpt && <p className="reader-excerpt">{selectedResource.excerpt}</p>}
        <GuideMarkdown content={selectedResource.body || selectedResource.body_md || selectedResource.content || 'Este recurso todavía no tiene contenido disponible. Vuelve a intentarlo más adelante.'} />
        <section className="reader-discussion" aria-labelledby="discussion-title">
          <div className="discussion-heading"><div><span className="section-kicker">COMUNIDAD / DISCUSIÓN</span><h3 id="discussion-title">Comparte tu perspectiva</h3></div><span className="discussion-count">{readerComments.length} comentarios</span></div>
          {/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(selectedResource.id ?? '')) ? <>
            <div className="discussion-list">
              {readerComments.length === 0 ? <p className="discussion-empty">Todavía no hay comentarios. Puedes iniciar la conversación.</p> : readerComments.map(comment => <article className="discussion-item" key={comment.id}><div className="discussion-avatar">{String(comment.profiles?.display_name || comment.profiles?.username || 'U').slice(0,1).toUpperCase()}</div><div><div className="discussion-author">{comment.profiles?.display_name || comment.profiles?.username || 'Miembro'} <time>{new Date(comment.created_at).toLocaleDateString('es-DO')}</time></div><p>{comment.body}</p></div></article>)}
            </div>
            <form className="discussion-form" onSubmit={submitComment}>
              <label htmlFor="comment-body">Tu comentario</label>
              <textarea id="comment-body" value={commentDraft} onChange={event => setCommentDraft(event.target.value)} maxLength={3000} rows={3} placeholder={session ? 'Aporta una idea, pregunta o experiencia…' : 'Inicia sesión para comentar…'} required />
              <div className="discussion-actions"><span>{commentDraft.length}/3000</span><button className="btn-primary" type="submit" disabled={commentBusy || !commentDraft.trim()}>{commentBusy ? 'Publicando…' : 'Publicar comentario'}</button></div>
            </form>
          </> : <p className="discussion-empty">Los comentarios están habilitados en las publicaciones de la comunidad. Esta guía editorial es de demostración.</p>}
          {commentMessage && <p className="discussion-feedback" role="status">{commentMessage}</p>}
        </section>
        {readerAttachments.length > 0 && <div className="reader-attachments"><h3>Archivos adjuntos</h3><div>{readerAttachments.map(file => file.type.startsWith('image/') ? <a href={file.url} target="_blank" rel="noreferrer" key={file.url}><img src={file.url} alt={file.name}/><span>{file.name}</span></a> : <a className="reader-file" href={file.url} target="_blank" rel="noreferrer" key={file.url}><FileText size={18}/><span>{file.name}</span><ArrowUpRight size={14}/></a>)}</div></div>}
      </section>
    </div>}
    {profileOpen && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !profileSaving) setProfileOpen(false) }}>
      <section className="auth-modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="profile-title">
        <button className="modal-close" onClick={() => setProfileOpen(false)} aria-label="Cerrar perfil" disabled={profileSaving}><X size={18}/></button>
        <span className="section-kicker">BRIFAN / PERFIL</span><h2 id="profile-title">Tu identidad en la comunidad.</h2>
        <p>Completa los datos que otros miembros verán junto a tus aportes.</p>
        {profileBusy ? <p className="py-8 text-sm text-slate-400">Cargando perfil…</p> : <form onSubmit={saveProfile}>
          <label>Nombre visible<input value={profileForm.display_name} onChange={event => setProfileForm(current => ({ ...current, display_name: event.target.value }))} maxLength={60} placeholder="Cómo te conocerán"/></label>
          <label>Nombre de usuario<input value={profileForm.username} onChange={event => setProfileForm(current => ({ ...current, username: event.target.value }))} maxLength={24} autoComplete="username" placeholder="ej. josefro_tech"/></label>
          <label>Biografía<textarea value={profileForm.bio} onChange={event => setProfileForm(current => ({ ...current, bio: event.target.value }))} maxLength={280} rows={3} placeholder="Cuéntale a la comunidad qué te interesa aprender o compartir."/></label>
          <label>Sitio web<input type="url" value={profileForm.website} onChange={event => setProfileForm(current => ({ ...current, website: event.target.value }))} maxLength={240} placeholder="https://tusitio.com"/></label>
          {profileMessage && <p className="auth-message" role="status">{profileMessage}</p>}
          <button className="btn-primary auth-submit" type="submit" disabled={profileSaving}>{profileSaving ? 'Guardando…' : 'Guardar perfil'}</button>
        </form>}
      </section>
    </div>}
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
