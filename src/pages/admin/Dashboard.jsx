import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useSite } from '../../context/SiteContext'
export default function Dashboard() {
  const { settings: s } = useSite()
  const [rows, setRows] = useState(null), [counts, setCounts] = useState({ total: 0, new: 0, contacted: 0 })
  useEffect(() => {
    (async () => {
      const q = st => { let r = supabase.from('contact_inquiries').select('*', { count: 'exact', head: true }); return st ? r.eq('status', st) : r }
      const [t, n, c, l] = await Promise.all([q(), q('new'), q('contacted'),
        supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }).limit(5)])
      setCounts({ total: t.count || 0, new: n.count || 0, contacted: c.count || 0 }); setRows(l.data || [])
    })()
  }, [])
  const stats = [['Total inquiries', counts.total], ['New', counts.new], ['Contacted', counts.contacted]]
  return (<>
    <h1>Dashboard</h1>
    <div className="stats">{stats.map(([l, v]) => <div className="stat" key={l}><span>{l}</span><b>{rows ? v : '–'}</b></div>)}</div>
    <div className="grid2">
      <section className="panel"><div className="ph"><h3>Latest inquiries</h3><Link to="/admin/inquiries">View all</Link></div>
        {!rows ? <div className="spinner" /> : rows.length === 0 ? <p className="muted">No inquiries yet. They appear here when someone uses the contact form.</p> :
          <table className="tbl"><tbody>{rows.map(r => <tr key={r.id}><td><b>{r.name}</b><br /><span className="muted small">{r.email}</span></td><td><span className={'pill ' + r.status}>{r.status}</span></td><td className="muted small">{new Date(r.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>}</section>
      <div>
        <section className="panel"><div className="ph"><h3>Contact information</h3><Link to="/admin/settings">Edit</Link></div>
          <dl className="info"><dt>Email</dt><dd>{s.email || '—'}</dd><dt>Phone</dt><dd>{s.phone || '—'}</dd><dt>Address</dt><dd>{s.address || '—'}</dd></dl></section>
        <section className="panel"><div className="ph"><h3>Website settings</h3></div><p><b>{s.company_name || '—'}</b></p><p className="muted">{s.tagline}</p></section>
        <section className="panel"><h3>Quick actions</h3><div className="row wrap-r">
          <Link className="btn primary sm" to="/admin/inquiries">Review inquiries</Link><Link className="btn outline sm" to="/admin/content">Edit content</Link><Link className="btn outline sm" to="/admin/settings">Edit settings</Link></div></section>
      </div></div></>)
}
