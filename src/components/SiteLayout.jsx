import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, ArrowRight } from 'lucide-react'
import { useSite } from '../context/SiteContext'
import { D } from '../data'
import '../site.css'
const NAV = [['/', 'Home'], ['/about', 'About'], ['/services', 'Services'], ['/why-us', 'Why Us'], ['/contact', 'Contact']]
export const useC = () => { const { content } = useSite(); return k => ({ ...D[k], ...Object.fromEntries(Object.entries(content[k] || {}).filter(([, v]) => v)) }) }
export default function SiteLayout() {
  const { pathname } = useLocation()
  const { settings: s } = useSite()
  const c = useC()
  const [open, setOpen] = useState(false), [solid, setSolid] = useState(false)
  useEffect(() => { window.scrollTo(0, 0); setOpen(false) }, [pathname])   // every page opens at the top
  useEffect(() => { const f = () => setSolid(window.scrollY > 20); f(); window.addEventListener('scroll', f); return () => window.removeEventListener('scroll', f) }, [])
  const name = s.company_name || 'Codex Innovation'
  const socials = [['Facebook', s.facebook], ['LinkedIn', s.linkedin], ['Instagram', s.instagram], ['YouTube', s.youtube]].filter(x => x[1])
  return (
    <div className="x">
      <header className={'x-head' + (solid || open ? ' solid' : '')}>
        <Link to="/" className="x-logo"><i />{name}</Link>
        <nav className={'x-nav' + (open ? ' open' : '')}>
          {NAV.map(([to, l]) => <NavLink key={to} to={to} end={to === '/'}>{l}</NavLink>)}
          <Link to="/contact" className="x-btn pri m-only">Get in Touch</Link>
        </nav>
        <Link to="/contact" className="x-btn pri d-only">Get in Touch <ArrowRight size={16} /></Link>
        <button className="x-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </header>
      <Outlet />
      <footer className="x-foot">
        <div className="x-wrap x-fgrid">
          <div><Link to="/" className="x-logo"><i />{name}</Link><p>{s.tagline || 'Smart Solutions for a Digital Future'}</p></div>
          <div><h4>Explore</h4>{NAV.map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}</div>
          <div><h4>Connect</h4>{s.email && <a href={'mailto:' + s.email}>{s.email}</a>}{s.phone && <a href={'tel:' + s.phone}>{s.phone}</a>}{socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noreferrer">{n}</a>)}
            {!s.email && !s.phone && !socials.length && <span>Details coming soon</span>}</div>
        </div>
        <p className="x-copy">{c('footer').content}</p>
      </footer>
    </div>)
}
