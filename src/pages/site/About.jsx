import { useC } from '../../components/SiteLayout'
import { CLIENTS, SERVICES } from '../../data'
import { PageHero, CtaBand } from './shared'
export default function About() {
  const a = useC()('about')
  return (<><PageHero title="About Us" sub={a.title} />
    <section className="x-sec"><div className="x-wrap x-prose">{a.content.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div></section>
    <section className="x-sec alt"><div className="x-wrap"><h2>What we do</h2><div className="x-tags">{SERVICES.map(s => <span key={s.name}><s.icon size={16} />{s.name}</span>)}</div>
      <h2 style={{ marginTop: '3rem' }}>Who we work with</h2><div className="x-tags">{CLIENTS.map(t => <span key={t}>{t}</span>)}</div></div></section>
    <CtaBand /></>)
}
