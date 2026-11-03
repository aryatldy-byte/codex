import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useC } from '../../components/SiteLayout'
export const PageHero = ({ title, sub }) => <section className="x-phero"><div className="x-wrap"><h1>{title}</h1>{sub && <p className="x-lead">{sub}</p>}</div></section>
export function CtaBand() {
  const c = useC().call(null, 'cta')
  return <section className="x-cta"><div className="x-wrap"><p className="x-kick">{c.subtitle}</p><h2>{c.title}</h2><p>{c.content}</p>
    <Link to="/contact" className="x-btn white lg">Contact Us <ArrowRight size={18} /></Link></div></section>
}
