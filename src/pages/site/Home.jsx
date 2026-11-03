import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useC } from '../../components/SiteLayout'
import { SERVICES, WHY } from '../../data'
import { CtaBand } from './shared'
export default function Home() {
  const c = useC(), h = c('hero'), a = c('about')
  return (<>
    <section className="x-hero"><div className="x-wrap x-hgrid">
      <div>
        <span className="x-chip"><b /> {h.subtitle}</span>
        <h1>{h.title}</h1>
        <p className="x-lead">{h.content}</p>
        <div className="x-row"><Link to="/contact" className="x-btn pri lg">Get in Touch <ArrowRight size={18} /></Link><Link to="/services" className="x-btn ghost lg">Explore Our Services</Link></div>
      </div>
      <div className="x-stack" aria-hidden="true">
        {SERVICES.map((s, i) => <div key={s.name} className="x-sc" style={{ '--i': i }}><span className="ic"><s.icon size={20} /></span><div><b>{s.name}</b><small>{s.tag}</small></div></div>)}
      </div>
    </div></section>

    <section className="x-sec"><div className="x-wrap x-split">
      <div><h2>{a.title}</h2></div>
      <div><p>{a.content.split(/\n\s*\n/)[0]}</p><Link to="/about" className="x-link">More about us <ArrowRight size={16} /></Link></div>
    </div></section>

    <section className="x-sec alt"><div className="x-wrap">
      <div className="x-head2"><h2>Our Services</h2><Link to="/services" className="x-link">View all <ArrowRight size={16} /></Link></div>
      <div className="x-bento">{SERVICES.map((s, i) => (
        <Link to="/services" key={s.name} className={'x-card b' + i}><span className="ic"><s.icon size={22} /></span><h3>{s.name}</h3><p>{s.tag}</p>
          <ul>{s.items.slice(0, 3).map(t => <li key={t}><Check size={14} />{t}</li>)}</ul></Link>))}</div>
    </div></section>

    <section className="x-sec"><div className="x-wrap"><h2>One partner. Multiple business solutions.</h2>
      <div className="x-why">{WHY.slice(0, 3).map(([t, d]) => <div key={t}><h4>{t}</h4><p>{d}</p></div>)}</div>
      <Link to="/why-us" className="x-link">Why Codex Innovation <ArrowRight size={16} /></Link></div></section>
    <CtaBand />
  </>)
}
