import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
const links = [['/admin', 'Dashboard', true], ['/admin/inquiries', 'Inquiries'], ['/admin/content', 'Content'], ['/admin/settings', 'Settings']]
export default function AdminLayout() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const out = async () => { await logout(); nav('/admin/login') }
  return (
    <div className="adm">
      <aside className={'side' + (open ? ' open' : '')}>
        <div className="brand">Codex<span>Admin</span></div>
        <nav onClick={() => setOpen(false)}>
          {links.map(([to, label, end]) => <NavLink key={to} to={to} end={end}>{label}</NavLink>)}
        </nav>
        <a className="viewsite" href="/" target="_blank" rel="noreferrer">View website</a>
      </aside>
      <div className="main">
        <header className="topbar">
          <button className="icon-btn menu" onClick={() => setOpen(o => !o)} aria-label="Menu">☰</button>
          <span className="who">{user?.email}</span>
          <button className="btn ghost sm" onClick={out}>Log out</button>
        </header>
        <main className="page"><Outlet /></main>
      </div>
    </div>)
}
