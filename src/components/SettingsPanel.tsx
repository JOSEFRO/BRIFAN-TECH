import { useEffect, useState } from 'react'
import { Bell, BookOpen, Globe2, Palette, Shield, UserRound, X } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type Preferences = {
  language: 'es' | 'en' | 'pt' | 'fr'
  theme: 'dark' | 'light' | 'system'
  accent_color: 'red' | 'blue' | 'violet' | 'cyan'
  reading_density: 'comfortable' | 'compact'
  email_replies: boolean
  email_publications: boolean
  in_app_updates: boolean
  profile_visibility: 'public' | 'members' | 'private'
}
type Profile = { display_name: string; username: string; bio: string; website: string; avatar_url: string }
const defaults: Preferences = { language: 'es', theme: 'dark', accent_color: 'red', reading_density: 'comfortable', email_replies: true, email_publications: false, in_app_updates: true, profile_visibility: 'public' }

export default function SettingsPanel({ session, onClose }: { session: Session; onClose: () => void }) {
  const [tab, setTab] = useState<'profile' | 'appearance' | 'language' | 'notifications' | 'reading' | 'privacy'>('profile')
  const [prefs, setPrefs] = useState<Preferences>(defaults)
  const [profile, setProfile] = useState<Profile>({ display_name: '', username: '', bio: '', website: '', avatar_url: '' })
  const [busy, setBusy] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      if (!supabase) return
      const [p, pref] = await Promise.all([
        supabase.from('profiles').select('display_name,username,bio,website,avatar_url').eq('id', session.user.id).maybeSingle(),
        supabase.from('user_preferences').select('*').eq('user_id', session.user.id).maybeSingle(),
      ])
      if (!active) return
      if (p.data) setProfile({ display_name: p.data.display_name ?? '', username: p.data.username ?? '', bio: p.data.bio ?? '', website: p.data.website ?? '', avatar_url: p.data.avatar_url ?? '' })
      if (pref.data) setPrefs({ ...defaults, ...pref.data })
      setBusy(false)
      if (p.error || pref.error) setMessage('Algunas preferencias no pudieron cargarse. Puedes volver a intentarlo.')
    }
    void load()
    return () => { active = false }
  }, [session.user.id])

  useEffect(() => {
    const root = document.documentElement
    const systemLight = window.matchMedia('(prefers-color-scheme: light)').matches
    root.dataset.theme = prefs.theme === 'system' ? (systemLight ? 'light' : 'dark') : prefs.theme
    root.dataset.accent = prefs.accent_color
    root.dataset.density = prefs.reading_density
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const syncTheme = () => { if (prefs.theme === 'system') root.dataset.theme = media.matches ? 'light' : 'dark' }
    media.addEventListener('change', syncTheme)
    return () => { media.removeEventListener('change', syncTheme); delete root.dataset.theme; delete root.dataset.accent; delete root.dataset.density }
  }, [prefs.theme, prefs.accent_color, prefs.reading_density])

  async function save() {
    if (!supabase) return
    setSaving(true); setMessage('')
    const [profileResult, preferenceResult] = await Promise.all([
      supabase.from('profiles').update({
        display_name: profile.display_name.trim() || null,
        bio: profile.bio.trim(),
        website: profile.website.trim() || null,
        avatar_url: profile.avatar_url.trim() || null,
      }).eq('id', session.user.id),
      supabase.from('user_preferences').upsert({ user_id: session.user.id, ...prefs, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }),
    ])
    setSaving(false)
    if (profileResult.error || preferenceResult.error) setMessage('No se pudieron guardar todos los cambios. Revisa los campos e inténtalo otra vez.')
    else setMessage('Configuración guardada correctamente.')
  }

  const tabs = [
    { id: 'profile', label: 'Mi perfil', icon: UserRound },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'language', label: 'Idioma', icon: Globe2 },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'reading', label: 'Lectura', icon: BookOpen },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
  ] as const
  const field = (label: string, value: string, update: (v: string) => void, placeholder: string, maxLength = 160) => (
    <label className="settings-field">{label}<input value={value} onChange={e => update(e.target.value)} maxLength={maxLength} placeholder={placeholder}/></label>
  )
  const toggle = (label: string, key: 'email_replies' | 'email_publications' | 'in_app_updates') => (
    <label className="settings-toggle"><span>{label}</span><input type="checkbox" checked={prefs[key]} onChange={e => setPrefs(v => ({ ...v, [key]: e.target.checked }))}/></label>
  )

  return <div className="modal-backdrop resource-backdrop settings-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
    <section className="resource-reader settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <button className="modal-close" onClick={onClose} aria-label="Cerrar configuración"><X size={18}/></button>
      <span className="section-kicker">BRIFAN / PERSONALIZACIÓN</span>
      <h2 id="settings-title">Configuración</h2>
      <p className="reader-excerpt">Personaliza tu cuenta y tu experiencia en BRIFAN TECH.</p>
      <div className="settings-layout">
        <nav className="settings-nav" aria-label="Secciones de configuración">{tabs.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => { setTab(item.id); setMessage('') }}><Icon size={16}/>{item.label}</button> })}</nav>
        <div className="settings-content">
          {busy ? <p className="settings-muted">Cargando tus preferencias…</p> : <>
            {tab === 'profile' && <section className="settings-section"><h3>Información pública</h3><p className="settings-muted">Estos datos ayudan a otros miembros a reconocerte.</p>
              {field('Nombre visible', profile.display_name ?? '', v => setProfile(p => ({ ...p, display_name: v })), 'Tu nombre', 60)}
              <label className="settings-field">Nombre de usuario<input value={profile.username} readOnly aria-readonly="true"/></label>
              {field('URL del avatar', profile.avatar_url ?? '', v => setProfile(p => ({ ...p, avatar_url: v })), 'https://…')}
              {field('Sitio web', profile.website ?? '', v => setProfile(p => ({ ...p, website: v })), 'https://tusitio.com')}
              <label className="settings-field">Biografía<textarea value={profile.bio ?? ''} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} rows={4} maxLength={500} placeholder="Cuéntale a la comunidad qué te interesa…"/></label>
            </section>}
            {tab === 'appearance' && <section className="settings-section"><h3>Apariencia</h3><p className="settings-muted">Ajusta el aspecto visual de la plataforma.</p><label className="settings-field">Tema<select value={prefs.theme} onChange={e => setPrefs(p => ({ ...p, theme: e.target.value as Preferences['theme'] }))}><option value="dark">Oscuro</option><option value="light">Claro</option><option value="system">Automático (sistema)</option></select></label><label className="settings-field">Color de acento<select value={prefs.accent_color} onChange={e => setPrefs(p => ({ ...p, accent_color: e.target.value as Preferences['accent_color'] }))}><option value="red">Rojo BRIFAN</option><option value="blue">Azul</option><option value="violet">Violeta</option><option value="cyan">Cian</option></select></label></section>}
            {tab === 'language' && <section className="settings-section"><h3>Idioma y región</h3><p className="settings-muted">Guarda tu idioma preferido para la experiencia y futuras traducciones de contenido.</p><label className="settings-field">Idioma preferido<select value={prefs.language} onChange={e => setPrefs(p => ({ ...p, language: e.target.value as Preferences['language'] }))}><option value="es">Español</option><option value="en">English</option><option value="pt">Português</option><option value="fr">Français</option></select></label><div className="settings-note">La selección queda guardada en tu cuenta. La traducción completa de todos los textos de la interfaz todavía requiere una fase de localización.</div></section>}
            {tab === 'notifications' && <section className="settings-section"><h3>Notificaciones</h3><p className="settings-muted">Elige qué avisos deseas recibir cuando esos canales estén disponibles.</p>{toggle('Respuestas a mis comentarios por correo', 'email_replies')}{toggle('Nuevas publicaciones por correo', 'email_publications')}{toggle('Avisos dentro de BRIFAN TECH', 'in_app_updates')}<div className="settings-note">Las preferencias quedan almacenadas; el envío automático de correos y las notificaciones push necesitan un servicio de notificaciones adicional.</div></section>}
            {tab === 'reading' && <section className="settings-section"><h3>Experiencia de lectura</h3><p className="settings-muted">Define cómo prefieres consultar los recursos.</p><label className="settings-field">Densidad del contenido<select value={prefs.reading_density} onChange={e => setPrefs(p => ({ ...p, reading_density: e.target.value as Preferences['reading_density'] }))}><option value="comfortable">Cómoda</option><option value="compact">Compacta</option></select></label></section>}
            {tab === 'privacy' && <section className="settings-section"><h3>Privacidad del perfil</h3><p className="settings-muted">Controla quién podrá consultar la información pública de tu perfil.</p><label className="settings-field">Visibilidad<select value={prefs.profile_visibility} onChange={e => setPrefs(p => ({ ...p, profile_visibility: e.target.value as Preferences['profile_visibility'] }))}><option value="public">Público</option><option value="members">Solo miembros</option><option value="private">Privado</option></select></label><div className="settings-note">La preferencia se guarda, pero el perfil público aún no aplica estos niveles de visibilidad. No se presenta como una barrera de privacidad hasta implementar sus reglas de acceso.</div></section>}
          </>}
        </div>
      </div>
      {message && <p className="auth-message settings-message" role="status">{message}</p>}
      <div className="settings-footer"><span className="settings-muted">{session.user.email}</span><button className="btn-primary" onClick={() => void save()} disabled={busy || saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button></div>
    </section>
  </div>
}
