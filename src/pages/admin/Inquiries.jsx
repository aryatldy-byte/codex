import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Modal, useUI } from '../../components/ui'
export default function Inquiries() {
  const { toast, confirm } = useUI()
  const [rows, setRows] = useState(null), [q, setQ] = useState(''), [st, setSt] = useState('all'), [sel, setSel] = useState(null)
  const load = async () => { const { data, error } = await supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false }); if (error) toast(error.message, 'err'); setRows(data || []) }
  useEffect(() => { load() }, [])
  const list = useMemo(() => (rows || []).filter(r => (st === 'all' || r.status === st) &&
    [r.name, r.email, r.phone, r.service, r.message].join(' ').toLowerCase().includes(q.toLowerCase())), [rows, q, st])
  async function setStatus(r, status) {
    const { error } = await supabase.from('contact_inquiries').update({ status }).eq('id', r.id)
    if (error) return toast(error.message, 'err')
    toast(status === 'contacted' ? 'Marked as contacted' : 'Status updated'); setSel(s => s && { ...s, status }); load()
  }
  async function del(r) {
    if (!await confirm({ title: 'Delete inquiry', message: `Delete the inquiry from ${r.name}? This cannot be undone.`, action: 'Delete', danger: true })) return
    const { error } = await supabase.from('contact_inquiries').delete().eq('id', r.id)
    if (error) return toast(error.message, 'err')
    toast('Inquiry deleted'); setSel(null); load()
  }
  function exportCsv() {
    const cols = ['created_at', 'name', 'email', 'phone', 'service', 'status', 'message']
    const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"'
    const csv = [cols.join(','), ...list.map(r => cols.map(c => esc(r[c])).join(','))].join('\n')
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `inquiries-${new Date().toISOString().slice(0, 10)}.csv` })
    a.click(); URL.revokeObjectURL(a.href); toast(`Exported ${list.length} inquiries`)
  }
  return (<>
    <div className="ph"><h1>Inquiries</h1><button className="btn outline" onClick={exportCsv} disabled={!list.length}>Export CSV</button></div>
    <div className="filters"><input placeholder="Search name, email, message…" value={q} onChange={e => setQ(e.target.value)} />
      <select value={st} onChange={e => setSt(e.target.value)}><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></div>
    <section className="panel scroll">{!rows ? <div className="spinner" /> : list.length === 0 ? <p className="muted">{rows.length ? 'No inquiries match your search.' : 'No inquiries yet.'}</p> :
      <table className="tbl"><thead><tr><th>Date</th><th>Name</th><th>Service</th><th>Status</th><th /></tr></thead>
        <tbody>{list.map(r => <tr key={r.id}><td className="small">{new Date(r.created_at).toLocaleDateString()}</td><td><b>{r.name}</b><br /><span className="muted small">{r.email}</span></td><td>{r.service || '—'}</td>
          <td><span className={'pill ' + r.status}>{r.status}</span></td>
          <td className="acts"><button className="btn ghost sm" onClick={() => setSel(r)}>View</button>
            {r.status === 'new' && <button className="btn outline sm" onClick={() => setStatus(r, 'contacted')}>Mark contacted</button>}
            <button className="btn danger sm" onClick={() => del(r)}>Delete</button></td></tr>)}</tbody></table>}</section>
    {sel && <Modal title="Inquiry details" onClose={() => setSel(null)} footer={<>
      <button className="btn danger" onClick={() => del(sel)}>Delete</button>
      {sel.status !== 'closed' && <button className="btn outline" onClick={() => setStatus(sel, 'closed')}>Close inquiry</button>}
      {sel.status === 'new' && <button className="btn primary" onClick={() => setStatus(sel, 'contacted')}>Mark contacted</button>}</>}>
      <dl className="info"><dt>Name</dt><dd>{sel.name}</dd><dt>Email</dt><dd><a href={'mailto:' + sel.email}>{sel.email}</a></dd><dt>Phone</dt><dd>{sel.phone || '—'}</dd>
        <dt>Service</dt><dd>{sel.service || '—'}</dd><dt>Received</dt><dd>{new Date(sel.created_at).toLocaleString()}</dd><dt>Status</dt><dd><span className={'pill ' + sel.status}>{sel.status}</span></dd></dl>
      <p className="msg">{sel.message}</p></Modal>}</>)
}
