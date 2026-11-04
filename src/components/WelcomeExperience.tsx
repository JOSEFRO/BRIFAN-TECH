import { useState } from 'react'
import { ArrowUpRight, Cpu, Layers3, Network, ShieldCheck, Sparkles } from 'lucide-react'

export default function WelcomeExperience() {
  const [leaving, setLeaving] = useState(false)
  const [hidden, setHidden] = useState(false)

  function enterPlatform() {
    if (leaving) return
    setLeaving(true)
    window.setTimeout(() => setHidden(true), 850)
  }

  if (hidden) return null

  return (
    <section className={`welcome-experience ${leaving ? 'welcome-leaving' : ''}`} aria-label="Bienvenida a BRIFAN TECH">
      <div className="welcome-noise" />
      <div className="welcome-grid" />
      <div className="welcome-stars" aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => <i key={index} style={{ '--star-index': index } as React.CSSProperties} />)}
      </div>
      <div className="welcome-topline"><span className="welcome-live-dot" /> DIGITAL KNOWLEDGE PLATFORM <span className="welcome-topline-year">EST. 2026</span></div>
      <div className="welcome-content">
        <div className="welcome-copy">
          <div className="welcome-eyebrow"><Sparkles size={13} /> UN NUEVO UNIVERSO DE CONOCIMIENTO</div>
          <div className="welcome-wordmark">BRIFAN<span>.</span><small>TECH</small></div>
          <h1>EL FUTURO NO SE OBSERVA.<br /><em>SE CONSTRUYE.</em></h1>
          <p>Explora nuevas ideas. Domina la tecnología. Comparte lo que sabes. Tu próximo gran descubrimiento comienza aquí.</p>
          <button className="welcome-enter" onClick={enterPlatform}>
            <span>ENTRAR AL ECOSISTEMA</span><ArrowUpRight size={18} />
          </button>
          <div className="welcome-footnote"><span>01</span> EXPLORA <i /> <span>02</span> APRENDE <i /> <span>03</span> COMPARTE</div>
        </div>
        <div className="welcome-visual" aria-hidden="true">
          <div className="welcome-aura" />
          <div className="welcome-orbit welcome-orbit-a"><span /><b /></div>
          <div className="welcome-orbit welcome-orbit-b"><span /><b /></div>
          <div className="welcome-orbit welcome-orbit-c" />
          <div className="welcome-core-shadow" />
          <div className="welcome-core">
            <div className="welcome-core-grid" />
            <div className="welcome-core-glass"><Layers3 size={72} strokeWidth={1.05} /></div>
            <div className="welcome-core-word">B<span>•</span>T</div>
          </div>
          <div className="welcome-data-card welcome-data-network"><Network size={16} /><span>NETWORKS</span><b>CONNECTED</b></div>
          <div className="welcome-data-card welcome-data-security"><ShieldCheck size={16} /><span>SECURITY</span><b>PROTECTED</b></div>
          <div className="welcome-data-card welcome-data-ai"><Cpu size={16} /><span>INTELLIGENCE</span><b>EVOLVING</b></div>
          <div className="welcome-coordinate">18° 30' N <span>·</span> 69° 59' W</div>
        </div>
      </div>
      <div className="welcome-bottomline"><span>BRIFAN TECH / KNOWLEDGE IN MOTION</span><span>SCROLL LESS. DISCOVER MORE.</span></div>
    </section>
  )
}
