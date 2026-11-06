import Header from './components/Header'
import LearningHub from './components/LearningHub'
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
  'Bases de datos': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85',
  'Cloud y DevOps': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85',
  'Hardware y electrónica': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85',
  'Soporte técnico': 'https://images.unsplash.com/photo-1662638600476-d563fffbb072?auto=format&fit=crop&w=1000&q=85',
  'Certificaciones y formación': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85',
}

const demoResources = learningGuides

export default function App() {
  const [query, setQuery] = useState('')
  const [liveResources, setLiveResources] = useState<any[]>([])
  const [loadingResources, setLoadingResources] = useState(true)
  const [resourceLoadError, setResourceLoadError] = useState(false)
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
  const [myPostsOpen, setMyPostsOpen] = useState(false)
  const [myArticles, setMyArticles] = useState<any[]>([])
  const [myPostsMessage, setMyPostsMessage] = useState('')
  const [readerComments, setReaderComments] = useState<any[]>([])
  const [commentDraft, setCommentDraft] = useState('')
  const [commentBusy, setCommentBusy] = useState(false)
  const [commentMessage, setCommentMessage] = useState('')

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
      if (!supabase || !selectedResource?.id) return
      const { data, error } = await supabase
        .from('comments')
        .select('id,body,created_at,author_id,profiles(display_name,username)')
        .eq('article_id', selectedResource.id)
        .eq('is_hidden', false)
        .order('created_at', { ascending: true })
        .limit(100)
      if (!active) return
      if (error) setCommentMessage('No fue posible cargar los comentarios.')
      else setReaderComments(data ?? [])
    }
    void loadComments()
    return () => { active = false }
  }, [selectedResource?.id])

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || !session || !selectedResource?.id) {
      setAuthMode('signin')
      setAuthOpen(true)
      setAuthMessage('Inicia sesión para participar en la conversación.')
      return
    }
    const body = commentDraft.trim()
    if (!body || body.length > 3000) return
    setCommentBusy(true)
    setCommentMessage('')
    const { error } = await supabase.from('comments').insert({
      article_id: selectedResource.id,
      author_id: session.user.id,
      body,
    })
    if (error) setCommentMessage('No se pudo publicar el comentario. Comprueba tu sesión e inténtalo de nuevo.')
    else {
      setCommentDraft('')
      const { data } = await supabase
        .from('comments')
        .select('id,body,created_at,author_id,profiles(display_name,username)')
        .eq('article_id', selectedResource.id)
        .eq('is_hidden', false)
        .order('created_at', { ascending: true })
        .limit(100)
      setReaderComments(data ?? [])
      setCommentMessage('Comentario publicado.')
    }
    setCommentBusy(false)
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

  async function loadMyArticles() {
    if (!supabase || !session?.user.id) return
    setMyPostsMessage('')
    const { data, error } = await supabase.from('articles')
      .select('id,author_id,title,excerpt,body_md,status,created_at,updated_at,categories(name)')
      .eq('author_id', session.user.id).order('updated_at', { ascending: false }).limit(100)
    if (error) { setMyPostsMessage('No se pudieron cargar tus publicaciones.'); return }
    setMyArticles(data ?? [])
  }

  async function deleteMyArticle(article: any) {
    if (!supabase || !session?.user.id || article.author_id !== session.user.id) return
    const match = String(article.body_md ?? '').match(/<!--BRIFAN_ATTACHMENTS:(.*?)-->/s)
    let files: Array<{path:string}> = []
    try { if (match) files = JSON.parse(match[1]) } catch { files = [] }
    if (files.length) {
      const { error: storageError } = await supabase.storage.from('brifan-articles').remove(files.map(file => file.path))
      if (storageError) { setMyPostsMessage('No se pudieron eliminar los archivos adjuntos; la publicación se conservó.'); return }
    }
    const { error } = await supabase.from('articles').delete().eq('id', article.id).eq('author_id', session.user.id)
    if (error) { setMyPostsMessage('No se pudo eliminar. Inténtalo de nuevo.'); return }
    setMyArticles(items => items.filter(item => item.id !== article.id))
    setMyPostsMessage('Publicación eliminada correctamente.')
  }

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
      if (data) setLiveResources(data.map((item:any)=>({id:item.id,excerpt:item.excerpt,body:item.body_md,type:String(item.content_type ?? 'article').toUpperCase(),title:item.title,category:item.categories?.name ?? 'Tecnología',level:item.difficulty==='beginner'?'Principiante':item.difficulty==='advanced'?'Avanzado':item.difficulty==='all'?'Todos':'Intermedio',time:(item.reading_minutes ?? 1)+' min',icon:BookOpen,color:'blue'})))
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
      const slug = `${slugBase}-${Date.now().toString(36)}`
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
          if (file.size > 50 * 1024 * 1024) throw new Error(`El archivo "${file.name}" supera el límite de 50 MB.`)
          const safeName = file.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100)
          const path = `${session.user.id}/${result.data.id}/${crypto.randomUUID()}-${safeName}`
          const { error: uploadError } = await supabase.storage.from('brifan-articles').upload(path, file, { contentType: file.type, upsert: false })
          if (uploadError) throw uploadError
          uploaded.push({ path, name: file.name, type: file.type })
        }
        if (uploaded.length) {
          const attachmentBlock = `\n\n<!--BRIFAN_ATTACHMENTS:${JSON.stringify(uploaded)}-->`
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
      setLoadingResources(true)
      setResourceLoadError(false)
      try {
        const { data, error } = await supabase.from('articles').select('id,title,excerpt,body_md,content_type,difficulty,reading_minutes,categories(name)').eq('status', 'published').order('published_at', { ascending: false }).limit(18)
        if (!active) return
        if (error) {
          setResourceLoadError(true)
          setLiveResources([])
          return
        }
        setLiveResources((data ?? []).map((item: any) => {
          const rawBody = item.body_md ?? ''
          const attachmentMatch = rawBody.match(/<!--BRIFAN_ATTACHMENTS:(.*?)-->/s)
          let attachments: Array<{ path: string; name: string; type: string }> = []
          try { if (attachmentMatch) attachments = JSON.parse(attachmentMatch[1]) } catch { attachments = [] }
          const cleanBody = attachmentMatch ? rawBody.slice(0, attachmentMatch.index).trim() : rawBody.trim()
          return { id: item.id, excerpt: item.excerpt, body: cleanBody, attachments, type: String(item.content_type ?? 'article').toUpperCase(), title: item.title, category: item.categories?.name ?? 'Tecnología', level: item.difficulty === 'beginner' ? 'Principiante' : item.difficulty === 'advanced' ? 'Avanzado' : item.difficulty === 'all' ? 'Todos' : 'Intermedio', time: (item.reading_minutes ?? 1) + ' min', icon: BookOpen, color: 'blue' }
        }))
      } catch {
        if (active) { setResourceLoadError(true); setLiveResources([]) }
      } finally {
        if (active) setLoadingResources(false)
      }
    }
    void loadResources()
    return () => { active = false }
  }, [])
  const resources = isSupabaseConfigured ? liveResources : demoResources
  const [active, setActive] = useState('Todo')
    useEffect(() => {
    const art = document.querySelector<HTMLElement>('.deep-hero-art')
    if (!art || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const move = (event: PointerEvent) => {
      const rect = art.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      art.style.transform = `perspective(1200px) rotateY(${(x * 3.2).toFixed(2)}deg) rotateX(${(-y * 2.4).toFixed(2)}deg)`
    }
    const reset = () => { art.style.transform = '' }
    art.addEventListener('pointermove', move)
    art.addEventListener('pointerleave', reset)
    return () => { art.removeEventListener('pointermove', move); art.removeEventListener('pointerleave', reset); reset() }
  }, [])

  const filtered = useMemo(() => resources.filter((r) =>
    (active === 'Todo' || r.category === active) &&
    (r.title + r.category + r.type).toLowerCase().includes(query.toLowerCase())
  ), [resources, active, query])

  return <div className="min-h-screen overflow-hidden bg-[#080d18] text-slate-100">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <Header
      session={session}
      isAdmin={isAdmin}
      onPublish={() => { setPublishMessage(''); setPublishOpen(true) }}
      onMyPosts={() => { setMyPostsOpen(true); void loadMyArticles() }}
      onAdmin={() => { setAdminOpen(true); setAdminMessage(''); void loadPendingArticles() }}
      onSignIn={() => { setAuthMode('signin'); setAuthOpen(true); setAuthMessage('') }}
      onSignUp={() => { setAuthMode('signup'); setAuthOpen(true); setAuthMessage('') }}
      onSignOut={() => { void supabase?.auth.signOut() }}
    />
    <main className="relative z-10">
      <section className="deep-hero mx-auto max-w-7xl px-5 sm:px-8">
        <div className="deep-hero-copy">
          <div className="eyebrow"><span className="pulse-dot"/> TU PRÓXIMO DESCUBRIMIENTO COMIENZA AQUÍ</div>
          <p className="deep-index">BRIFAN TECH <span>—</span> DIGITAL KNOWLEDGE PLATFORM / 2026</p>
          <h1>El futuro no se<br/>espera. <span className="gradient-text">Se construye.</span></h1>
          <p className="deep-lead">Una experiencia para explorar el mundo digital: aprende redes, ciberseguridad, programación e inteligencia artificial con guías prácticas, rutas de aprendizaje y una comunidad que comparte conocimiento.</p>
          <div className="deep-actions"><a href="#explorar" className="btn-primary">Explorar la biblioteca <ArrowRight size={17}/></a><a href="#panorama" className="deep-text-link">Entrar al universo <ArrowUpRight size={16}/></a></div>
          <div className="deep-proof"><div><b>10</b><span>ÁREAS DE TECNOLOGÍA</span></div><i/><div><b>03</b><span>RUTAS DE APRENDIZAJE</span></div><i/><div><b>16</b><span>MÓDULOS INICIALES</span></div></div>
        </div>
        <div className="deep-hero-art"><div className="deep-art-image" role="img" aria-label="Centro de datos tecnológico iluminado"/><div className="deep-art-shade"/><div className="deep-orbit deep-orbit-one"/><div className="deep-orbit deep-orbit-two"/>
          <div className="deep-glass-card deep-card-top"><span className="deep-card-icon"><Network size={17}/></span><div><small>NETWORK SYSTEMS</small><b>Conecta el conocimiento</b></div><span className="deep-live">CORE</span></div>
          <div className="deep-glass-card deep-card-bottom"><span className="deep-card-icon purple"><BrainCircuit size={18}/></span><div><small>INTELLIGENCE / 01</small><b>Ideas que evolucionan</b></div><ArrowUpRight size={17}/></div>
          <div className="deep-core"><div className="deep-core-inner"><Layers3 size={48}/><b>BRIFAN</b><small>TECH ECOSYSTEM</small></div></div>
          <span className="deep-coordinate coordinate-a">18° / 70° — DIGITAL SPACE</span><span className="deep-coordinate coordinate-b">EXPLORE BEYOND LIMITS</span>
        </div>
      </section>
      <section className="signal-section mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <div className="signal-panel">
          <div className="signal-copy"><span className="section-kicker">BRIFAN / TECH ECOSYSTEM</span><h2>El conocimiento <span className="gradient-text">se conecta.</span></h2><p>Un mapa visual de las disciplinas que transforman el mundo digital. Descubre conexiones entre redes, datos, código e inteligencia artificial.</p><div className="signal-points"><span><i className="signal-dot cyan-dot"/> Redes conectadas</span><span><i className="signal-dot violet-dot"/> Datos en flujo</span><span><i className="signal-dot green-dot"/> Ideas en evolución</span></div></div>
          <div className="data-visual" aria-label="Visualización animada de datos tecnológicos">
            <div className="data-grid"/>
            <svg className="network-svg" viewBox="0 0 520 300" role="img" aria-label="Red de nodos conectados">
              <defs><linearGradient id="netLine" x1="0" x2="1"><stop stopColor="#43d9e8" stopOpacity=".12"/><stop offset="1" stopColor="#a78bfa" stopOpacity=".85"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
              <g stroke="url(#netLine)" strokeWidth="1.4" fill="none"><path d="M70 150 160 65 260 105 365 48 450 130 350 230 245 190 145 245 70 150"/><path d="M160 65 145 245M260 105 245 190M365 48 350 230M70 150 245 190 450 130M160 65 350 230M260 105 450 130"/></g>
              <g className="network-nodes" filter="url(#glow)"><circle cx="70" cy="150" r="7"/><circle cx="160" cy="65" r="6"/><circle cx="260" cy="105" r="10"/><circle cx="365" cy="48" r="6"/><circle cx="450" cy="130" r="8"/><circle cx="350" cy="230" r="7"/><circle cx="245" cy="190" r="6"/><circle cx="145" cy="245" r="8"/></g>
              <circle className="network-pulse" cx="260" cy="105" r="22"/><circle className="network-pulse delay" cx="450" cy="130" r="18"/>
            </svg>
            <div className="data-widget widget-a"><span>NODOS DEL ECOSISTEMA</span><strong>↗ <b>10 ÁREAS</b></strong><div className="mini-bars">{[24,38,30,52,42,68,50,78,62,92,72,100].map((v,i)=><i key={i} style={{height:v+'%'}}/>)}</div></div>
            <div className="data-widget widget-b"><span>RUTAS DE APRENDIZAJE</span><div className="flow-ring"><b>03</b></div><small>Rutas para comenzar</small></div>
          </div>
        </div>
      </section>
      <section id="panorama" className="panorama-section mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="panorama-heading"><div><span className="section-kicker">INTERACTIVE / 3D WORLD</span><h2>Explora la tecnología <span className="gradient-text">en otra dimensión.</span></h2><p>Un recorrido visual por las áreas que mueven el universo digital. Cambia la vista y descubre cada zona.</p></div><div className="panorama-switch" role="group" aria-label="Cambiar visualización"><button className={panoramaMode === 'panorama' ? 'chosen' : ''} onClick={() => setPanoramaMode('panorama')}>Panorama 3D</button><button className={panoramaMode === 'network' ? 'chosen' : ''} onClick={() => setPanoramaMode('network')}>Red conectada</button></div></div>
        <div className={'panorama-stage '+(panoramaMode === 'network' ? 'network-mode' : '')}>
          <div className="panorama-sky"/><div className="panorama-horizon"/>
          <div className="panorama-world" role="img" aria-label="Escena tecnológica tridimensional decorativa con nodos, plataformas y conexiones">
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
          <div className="panorama-label label-top"><span className="live-indicator"/> DIGITAL UNIVERSE <small>EXPERIENCIA INTERACTIVA</small></div>
          <button className="hotspot hotspot-network" onClick={() => {setActive('Redes y conectividad');document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}}><Network size={15}/><span>Redes y conectividad</span><i/></button>
          <button className="hotspot hotspot-ai" onClick={() => {setActive('Inteligencia artificial');document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}}><BrainCircuit size={15}/><span>Inteligencia artificial</span><i/></button>
          <button className="hotspot hotspot-security" onClick={() => {setActive('Ciberseguridad');document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}}><ShieldCheck size={15}/><span>Ciberseguridad</span><i/></button>
          <div className="panorama-caption"><b>{panoramaMode === 'panorama' ? '01 / PANORAMA INMERSIVO' : '02 / MAPA DE CONEXIONES'}</b><span>{panoramaMode === 'panorama' ? 'Arquitectura digital · Profundidad 3D · Movimiento ambiental' : 'Nodos activos · Rutas de datos · Ecosistema conectado'}</span></div>
          <div className="panorama-coordinates">BRIFAN TECH <span>•</span> 3D EXPERIENCE <span>•</span> 2026</div>
        </div>
      </section>
      <section className="border-y border-white/[.07] bg-white/[.018]"><div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:grid-cols-3 sm:px-8"><div className="flex items-center gap-4"><span className="stat-icon"><BookOpen size={19}/></span><div><b className="block text-sm">Conocimiento compartido</b><span className="text-xs text-slate-500">Experiencias que ayudan a crecer</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><FileText size={19}/></span><div><b className="block text-sm">Recursos prácticos</b><span className="text-xs text-slate-500">Material para aprender haciendo</span></div></div><div className="flex items-center gap-4"><span className="stat-icon"><Globe2 size={19}/></span><div><b className="block text-sm">Comunidad tecnológica</b><span className="text-xs text-slate-500">Distintas áreas, una misma pasión</span></div></div></div></section>
      <section id="categorias" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">01 / EXPLORA POR ÁREA</span><h2>Un universo de <span className="gradient-text">posibilidades.</span></h2></div><a href="#explorar" className="text-sm font-semibold text-cyan-300">Ver contenido <ArrowUpRight size={15} className="inline"/></a></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(({name,icon:Icon,tone},i)=><button key={name} onClick={()=>{setActive(name);document.getElementById('explorar')?.scrollIntoView({behavior:'smooth'})}} className="category-card group text-left"><div className="category-card-image"><img src={categoryVisuals[name] ?? categoryVisuals['Programación']} alt="" loading="lazy" decoding="async" onError={event => { event.currentTarget.style.display = 'none' }}/></div><div className={'category-icon '+tone}><Icon size={22}/></div><div className="mt-7 flex items-end justify-between"><div><span className="mb-2 block text-xs text-slate-500">{String(i + 1).padStart(2, '0')} / ÁREA</span><h3>{name}</h3><span className="mt-2 block text-xs text-slate-500">Explorar contenido</span></div><ArrowUpRight className="text-slate-600 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-300"/></div></button>)}</div></section>
      <LearningHub />
      <section id="explorar" className="border-y border-white/[.07] bg-[#0b1220]/80"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="section-heading"><div><span className="section-kicker">02 / BIBLIOTECA</span><h2>Descubre algo <span className="gradient-text">nuevo.</span></h2><p className="mt-3 text-sm text-slate-400">Guías, tutoriales y recursos para llevar tus conocimientos más lejos.</p></div></div><div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{['Todo',...categories.map(c=>c.name)].map(item=><button key={item} onClick={()=>setActive(item)} className={'filter-pill '+(active===item?'selected':'')}>{item}</button>)}</div><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar contenido..."/></label></div><div className="mt-8 grid gap-5 lg:grid-cols-3">{loadingResources ? <div className="col-span-full py-14 text-center text-sm text-slate-500">Cargando publicaciones...</div> : resourceLoadError ? <div className="col-span-full rounded-2xl border border-rose-400/20 bg-rose-400/5 py-12 text-center text-sm text-rose-200" role="status">No se pudieron cargar los recursos publicados. Comprueba la conexión e inténtalo más tarde.</div> : filtered.map(({id,type,title,category,level,time,color})=><article key={id ?? title} className="resource-card"><div className={'resource-art '+color}><img className="resource-photo" src={categoryVisuals[category] ?? categoryVisuals['Programación']} alt="" loading="lazy" decoding="async" onError={event => { event.currentTarget.style.display = 'none' }}/><div className="art-orbit"/><span className="resource-type">{type}</span><span className="resource-image-caption">{category}</span></div><div className="p-5"><span className="text-xs font-semibold text-cyan-300">{category}</span><h3 className="mt-3 min-h-14 text-lg font-bold leading-snug">{title}</h3><p className="mt-2 min-h-10 text-xs leading-6 text-slate-400">{(resources.find((item: any) => item.id === id || item.title === title)?.excerpt) ?? "Abre este recurso para consultar su contenido."}</p><div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-500"><span>{level} · {time}</span><div className="flex items-center gap-2"><button onClick={() => setSelectedResource(resources.find((item: any) => item.id === id || item.title === title))} className="rounded-lg px-3 py-2 font-semibold text-cyan-300 hover:bg-cyan-300/10">Leer guía <ArrowUpRight size={14} className="inline"/></button><button aria-label={savedIds.includes(id) ? "Quitar de guardados" : "Guardar recurso"} aria-pressed={Boolean(id && savedIds.includes(id))} onClick={() => void toggleBookmark(id)} disabled={!id} className="rounded-lg p-2 hover:bg-white/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"><Bookmark size={16} fill={id && savedIds.includes(id) ? "currentColor" : "none"}/></button></div></div></div></article>)}{!loadingResources && !resourceLoadError && filtered.length===0&&<div className="col-span-full rounded-2xl border border-dashed border-white/15 py-14 text-center text-sm text-slate-500">{resources.length===0 ? 'Todavía no hay publicaciones aprobadas. Puedes volver más tarde o compartir la primera guía.' : 'No encontramos contenido con esos filtros. Prueba otra búsqueda.'}</div>}</div><p className="mt-5 text-xs text-slate-600">{isSupabaseConfigured ? (resourceLoadError ? 'La biblioteca no pudo conectar con Supabase.' : 'Contenido publicado desde Supabase.') : 'Vista de demostración con guías locales. Configura Supabase para activar publicaciones y cuentas.'}</p></div></section>
      <section id="comunidad" className="mx-auto max-w-7xl px-5 py-20 sm:px-8"><div className="community-panel"><div className="relative z-10 max-w-2xl"><span className="section-kicker">03 / CONSTRUYAMOS JUNTOS</span><h2 className="mt-4 text-3xl font-black sm:text-4xl">Tu experiencia también puede <span className="gradient-text">inspirar.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">BRIFAN TECH busca reunir a estudiantes, profesionales y entusiastas para compartir soluciones, documentar aprendizajes y hacer crecer la comunidad tecnológica.</p><button className="btn-primary mt-7" onClick={() => {setAuthMode("signup");setAuthOpen(true);setAuthMessage("")}}>Crear cuenta gratis <ArrowUpRight size={16}/></button></div><div className="community-symbol"><Layers3 size={100} strokeWidth={.7}/></div></div></section>
    </main>
    <footer id="nosotros" className="border-t border-white/[.08]"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><span className="brand-mark small"><Layers3 size={16}/></span><b className="tracking-[.14em] text-slate-300">BRIFAN.TECH</b><span>© 2026</span></div><p>Explora. Aprende. Comparte.</p><a href="https://github.com/JOSEFRO/BRIFAN-TECH" target="_blank" rel="noreferrer" className="hover:text-cyan-300">Código en GitHub <ArrowUpRight size={13} className="inline"/></a></div></footer>
    {myPostsOpen && session && <div className="modal-backdrop resource-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setMyPostsOpen(false)}}>
      <section className="resource-reader publish-reader" role="dialog" aria-modal="true" aria-labelledby="my-posts-title">
        <button className="modal-close" onClick={()=>setMyPostsOpen(false)} aria-label="Cerrar"><X size={18}/></button>
        <span className="section-kicker">BRIFAN / MI ESPACIO</span><h2 id="my-posts-title">Mis publicaciones</h2>
        <p className="reader-excerpt">Consulta tus aportes, revisa su estado y elimina los que hayas enviado por error.</p>
        {myPostsMessage && <p className="auth-message" role="status">{myPostsMessage}</p>}
        {myArticles.length===0 ? <p className="py-8 text-sm text-slate-400">Todavía no has enviado publicaciones.</p> : <div className="grid gap-3">{myArticles.map(article=><article key={article.id} className="rounded-xl border border-white/10 bg-white/[.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-cyan-300">{article.categories?.name ?? 'Tecnología'}</span><span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{({draft:'Borrador',pending:'En revisión',published:'Publicada',rejected:'Rechazada',archived:'Archivada'} as Record<string,string>)[article.status] ?? article.status}</span></div>
          <h3 className="mt-2 font-bold text-white">{article.title}</h3><p className="mt-2 text-sm text-slate-400">{article.excerpt}</p>
          <button className="btn-ghost mt-4" onClick={()=>{if(window.confirm('¿Eliminar esta publicación y sus archivos adjuntos? Esta acción no se puede deshacer.')) void deleteMyArticle(article)}}>Eliminar publicación</button>
        </article>)}</div>}
        <button className="btn-secondary mt-5" onClick={()=>void loadMyArticles()}>Actualizar lista</button>
      </section>
    </div>}
    {adminOpen && isAdmin && <div className="modal-backdrop resource-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setAdminOpen(false)}}>
      <section className="resource-reader publish-reader" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <button className="modal-close" onClick={()=>setAdminOpen(false)} aria-label="Cerrar"><X size={18}/></button>
        <span className="section-kicker">BRIFAN / MODERACIÓN</span><h2 id="admin-title">Administración de publicaciones</h2>
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
        <h2 id="resource-reader-title">{selectedResource.title}</h2>
        <div className="reader-meta"><span>{selectedResource.level}</span><span>{selectedResource.time}</span></div>
        {selectedResource.excerpt && <p className="reader-excerpt">{selectedResource.excerpt}</p>}
        <div className="reader-content">{selectedResource.body || selectedResource.body_md || selectedResource.content || 'Este recurso todavía no tiene contenido disponible. Vuelve a intentarlo más adelante.'}</div>
        <section className="reader-discussion" aria-labelledby="discussion-title">
          <div className="discussion-heading"><div><span className="section-kicker">COMUNIDAD / DISCUSIÓN</span><h3 id="discussion-title">Comparte tu perspectiva</h3></div><span className="discussion-count">{readerComments.length} comentarios</span></div>
          {selectedResource.id ? <>
            <div className="discussion-list">
              {readerComments.length === 0 ? <p className="discussion-empty">Todavía no hay comentarios. Puedes iniciar la conversación.</p> : readerComments.map(comment => <article className="discussion-item" key={comment.id}><div className="discussion-avatar">{String(comment.profiles?.display_name || comment.profiles?.username || 'U').slice(0,1).toUpperCase()}</div><div><div className="discussion-author">{comment.profiles?.display_name || comment.profiles?.username || 'Miembro'} <time>{new Date(comment.created_at).toLocaleDateString('es-DO')}</time></div><p>{comment.body}</p></div></article>)}
            </div>
            <form className="discussion-form" onSubmit={submitComment}>
              <label htmlFor="comment-body">Tu comentario</label>
              <textarea id="comment-body" value={commentDraft} onChange={event => setCommentDraft(event.target.value)} maxLength={3000} rows={3} placeholder={session ? 'Aporta una idea, pregunta o experiencia…' : 'Inicia sesión para comentar…'} required />
              <div className="discussion-actions"><span>{commentDraft.length}/3000</span><button className="btn-primary" type="submit" disabled={commentBusy || !commentDraft.trim()}>{commentBusy ? 'Publicando…' : 'Publicar comentario'}</button></div>
            </form>
          </> : <p className="discussion-empty">Los comentarios estarán disponibles cuando el recurso se publique en la biblioteca.</p>}
          {commentMessage && <p className="discussion-feedback" role="status">{commentMessage}</p>}
        </section>
        {readerAttachments.length > 0 && <div className="reader-attachments"><h3>Archivos adjuntos</h3><div>{readerAttachments.map(file => file.type.startsWith('image/') ? <a href={file.url} target="_blank" rel="noreferrer" key={file.url}><img src={file.url} alt={file.name}/><span>{file.name}</span></a> : <a className="reader-file" href={file.url} target="_blank" rel="noreferrer" key={file.url}><FileText size={18}/><span>{file.name}</span><ArrowUpRight size={14}/></a>)}</div></div>}
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
