import { Check } from 'lucide-react'
import { SERVICES } from '../../data'
import { PageHero, CtaBand } from './shared'
export default function Services() {
  return (<><PageHero title="Our Services" sub="Technology, digital and professional services under one roof." />
    <section className="x-sec"><div className="x-wrap x-svc">{SERVICES.map(s => (
      <article key={s.name} className="x-card big"><span className="ic"><s.icon size={24} /></span><h3>{s.name}</h3><p className="x-tag">{s.tag}</p>
        <ul className="cols">{s.items.map(t => <li key={t}><Check size={14} />{t}</li>)}</ul></article>))}</div></section>
    <CtaBand /></>)
}
