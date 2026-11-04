import { useEffect, useState } from 'react'
import { ArrowUpRight, Globe2, Users, Wifi, BookOpen } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Member = {
  id: string
  display_name: string | null
  username: string | null
  bio: string | null
  website: string | null
  created_at: string
}

type Activity = {
  id: string
  title: string
  excerpt: string | null
  content_type: string
  published_at: string | null
  created_at: string
  author_id: string
  categories?: { name?: string } | null
}

function safeWebsite(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export default function CommunityHub({ onJoin }: { onJoin: () => void }) {
  const [members, setMembers] = useState<Member[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    async function loadCommunity() {
      if (!supabase) {
        setMessage('La comunidad estará disponible cuando se conecte Supabase.')
        setLoading(false)
        return
      }

      const [memberResult, activityResult] = await Promise.all([
        supabase.from('profiles')
          .select('id,display_name,username,bio,website,created_at')
          .order('created_at', { ascending: false })
          .limit(6),
        supabase.from('articles')
          .select('id,title,excerpt,content_type,published_at,created_at,author_id,categories(name)')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(4),
      ])

      if (!active) return
      if (memberResult.error || activityResult.error) {
        setMessage('No se pudo cargar toda la actividad de la comunidad. Inténtalo de nuevo más tarde.')
      } else {
        setMembers((memberResult.data ?? []) as Member[])
        setActivity((activityResult.data ?? []) as Activity[])
      }
      setLoading(false)
    }

    void loadCommunity()
    return () => { active = false }
  }, [])

  const memberById = new Map(members.map(member => [member.id, member]))

  return (
    <section id="comunidad" className="community-hub mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="community-hub-heading">
        <div>
          <span className="section-kicker">03 / COMUNIDAD EN MOVIMIENTO</span>
          <h2>Conocimiento que <span className="gradient-text">conecta.</span></h2>
          <p>Conoce a quienes forman parte de BRIFAN TECH y descubre lo último que comparten.</p>
        </div>
        <button className="btn-primary" onClick={onJoin}>Unirme a la comunidad <ArrowUpRight size={16}/></button>
      </div>

      {message && <p className="community-feedback" role="status">{message}</p>}
      {loading ? (
        <div className="community-loading"><span className="community-pulse"/><span>Cargando comunidad…</span></div>
      ) : (
        <div className="community-hub-grid">
          <section className="community-column" aria-labelledby="community-members-title">
            <div className="community-column-heading">
              <div><Users size={17}/><h3 id="community-members-title">Miembros recientes</h3></div>
              <span>{members.length} perfiles</span>
            </div>
            {members.length === 0 ? (
              <div className="community-empty"><Users size={25}/><p>Aún no hay perfiles públicos. Sé parte de los primeros miembros.</p><button onClick={onJoin}>Crear mi perfil <ArrowUpRight size={14}/></button></div>
            ) : (
              <div className="community-members-list">
                {members.map(member => {
                  const label = member.display_name?.trim() || member.username || 'Miembro BRIFAN'
                  const website = safeWebsite(member.website)
                  return (
                    <article className="community-member-card" key={member.id}>
                      <div className="community-member-avatar">{label.slice(0, 1).toUpperCase()}</div>
                      <div className="community-member-copy">
                        <strong>{label}</strong>
                        <span>{member.username ? '@' + member.username : 'Miembro de BRIFAN TECH'}</span>
                        {member.bio && <p>{member.bio}</p>}
                      </div>
                      {website && <a className="community-member-link" href={website} target="_blank" rel="noreferrer" aria-label={'Sitio web de ' + label}><Globe2 size={15}/></a>}
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <section className="community-column" aria-labelledby="community-activity-title">
            <div className="community-column-heading">
              <div><Wifi size={17}/><h3 id="community-activity-title">Actividad reciente</h3></div>
              <a href="#explorar">Ver biblioteca <ArrowUpRight size={13}/></a>
            </div>
            {activity.length === 0 ? (
              <div className="community-empty"><BookOpen size={25}/><p>Las nuevas guías y publicaciones aprobadas aparecerán aquí.</p><button onClick={onJoin}>Compartir conocimiento <ArrowUpRight size={14}/></button></div>
            ) : (
              <div className="community-activity-list">
                {activity.map(item => {
                  const author = memberById.get(item.author_id)
                  const authorName = author?.display_name || author?.username || 'Miembro BRIFAN'
                  const date = item.published_at || item.created_at
                  return (
                    <article className="community-activity-card" key={item.id}>
                      <div className="community-activity-top"><span>{item.categories?.name || 'Tecnología'}</span><time dateTime={date}>{new Date(date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</time></div>
                      <h4>{item.title}</h4>
                      {item.excerpt && <p>{item.excerpt}</p>}
                      <div className="community-activity-bottom"><span>{authorName}</span><a href="#explorar">Leer en biblioteca <ArrowUpRight size={13}/></a></div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </section>
  )
}
