import { WHY } from '../../data'
import { PageHero, CtaBand } from './shared'
export default function WhyUs() {
  return (<><PageHero title="Why Codex Innovation?" sub="One Partner. Multiple Business Solutions." />
    <section className="x-sec"><div className="x-wrap"><p className="x-prose" style={{ maxWidth: '65ch' }}>Modern businesses often require support across several different areas. Codex Innovation brings technology, digital services, financial support, and healthcare-related services together under one roof.</p>
      <div className="x-bento why">{WHY.map(([t, d], i) => <div className="x-card" key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></div></section>
    <CtaBand /></>)
}
