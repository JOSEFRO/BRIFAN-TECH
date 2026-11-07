import { useState } from 'react'
import { ArrowUpRight, FileText, LogOut, Menu, Settings, ShieldCheck, X } from 'lucide-react'
import type { Session } from '@supabase/supabase-js'

type HeaderProps = {
  session: Session | null
  isAdmin: boolean
  onPublish: () => void
  onMyPosts: () => void
  onAdmin: () => void
  onSettings: () => void
  onSignIn: () => void
  onSignUp: () => void
  onSignOut: () => void
}

export default function Header({
  session,
  isAdmin,
  onPublish,
  onMyPosts,
  onAdmin,
  onSettings,
  onSignIn,
  onSignUp,
  onSignOut,
}: HeaderProps) {
  const [menu, setMenu] = useState(false)

  return (
    <>
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="#" className="flex items-center gap-3"><img className="brand-mark-image" src="/BRIFAN-TECH/josefro-mark.svg" alt="JOSEFRO" /><span className="brand-word-stack"><span className="text-lg font-black tracking-[.16em]">BRIFAN<span className="text-cyan-300">.</span>TECH</span><small>BY JOSEFRO</small></span></a>
        <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex"><a className="nav-link active" href="#explorar">Explorar</a><a className="nav-link" href="#categorias">Categorías</a><a className="nav-link" href="#comunidad">Comunidad</a><a className="nav-link" href="#nosotros">Acerca de</a></nav>
        <div className="hidden items-center gap-3 md:flex">{session ? <><button className="btn-primary" onClick={onPublish}><FileText size={15}/> Publicar</button><button className="btn-secondary" onClick={onMyPosts}><FileText size={15}/> Mis publicaciones</button>{isAdmin && <button className="btn-secondary" onClick={onAdmin}><ShieldCheck size={15}/> Administración</button>}<button className="btn-secondary" onClick={onSettings}><Settings size={15}/> Configuración</button><span className="text-xs text-slate-400">{session.user.email}</span><button className="btn-ghost" onClick={onSignOut}><LogOut size={15}/> Salir</button></> : <><button className="btn-ghost" onClick={onSignIn}>Iniciar sesión</button><button className="btn-primary" onClick={onSignUp}>Únete gratis <ArrowUpRight size={16}/></button></>}</div>
        <button className="rounded-xl border border-white/10 p-2 md:hidden" onClick={() => setMenu(!menu)} aria-label="Abrir menú">{menu ? <X/> : <Menu/>}</button>
      </header>
      {menu && <div className="relative z-30 mx-5 rounded-2xl border border-white/10 bg-slate-900 p-5 md:hidden"><div className="flex flex-col gap-4 text-sm text-slate-300"><a href="#explorar" onClick={() => setMenu(false)}>Explorar</a><a href="#categorias" onClick={() => setMenu(false)}>Categorías</a><a href="#comunidad" onClick={() => setMenu(false)}>Comunidad</a><a href="#nosotros" onClick={() => setMenu(false)}>Acerca de</a><div className="border-t border-white/10 pt-4">{session ? <div className="flex flex-col gap-3"><span className="break-all text-xs text-slate-400">{session.user.email}</span><button className="btn-primary justify-start" onClick={() => { onPublish(); setMenu(false) }}><FileText size={15}/> Publicar contenido</button><button className="btn-secondary justify-start" onClick={() => { onMyPosts(); setMenu(false) }}><FileText size={15}/> Mis publicaciones</button>{isAdmin && <button className="btn-secondary justify-start" onClick={() => { onAdmin(); setMenu(false) }}><ShieldCheck size={15}/> Administración</button>}<button className="btn-secondary justify-start" onClick={() => { onSettings(); setMenu(false) }}><Settings size={15}/> Configuración</button><button className="btn-ghost justify-start" onClick={() => { onSignOut(); setMenu(false) }}><LogOut size={15}/> Cerrar sesión</button></div> : <div className="flex flex-col gap-2"><button className="btn-ghost justify-start" onClick={() => { onSignIn(); setMenu(false) }}>Iniciar sesión</button><button className="btn-primary" onClick={() => { onSignUp(); setMenu(false) }}>Únete gratis <ArrowUpRight size={16}/></button></div>}</div></div></div>}
    </>
  )
}
