import { useState } from 'react'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import { supabase, configured } from '../../lib/supabase'
import { useSite } from '../../context/SiteContext'
import { useUI } from '../../components/ui'
import { useC } from '../../components/SiteLayout'
import { SERVICES } from '../../data'
import { PageHero } from './shared'
const E0 = { name: '', email: '', phone: '', service: '', message: '' }
export default function Contact() {
  const { settings: s } = useSite(), { toast } = useUI(), c = useC()('contact')
  const [f, setF] = useState(E0), [busy, setBusy] = useState(false)
  const set = k => e => setF({ ...f, [k]: e.target.value })
  async function submit(e) {
    e.preventDefault()
    if (!configured) return toast('Supabase is not configured yet.', 'err')
    setBusy(true)
    const { error } = await supabase.from('contact_inquiries').insert({ ...f, status: 'new' })
    setBusy(false)
    if (error) return toast('Could not send your message. Please try again.', 'err')
    setF(E0); toast('Thanks! We have received your message.')
  }
  const rows = [[MapPin, 'Address', s.address], [Phone, 'Phone', s.phone, 'tel:'], [Mail, 'Email', s.email, 'mailto:'], [Globe, 'Website', s.website]].filter(r => r[2])
  return (<><PageHero title={c.title} sub={c.subtitle} />
    <section className="x-sec"><div className="x-wrap x-cgrid">
      <div>{c.content && <p className="x-prose">{c.content}</p>}
        <div className="x-info">{rows.length ? rows.map(([I, l, v, p]) => <div key={l}><span className="ic"><I size={18} /></span><div><small>{l}</small>{p ? <a href={p + v}>{v}</a> : <b>{v}</b>}</div></div>) : <p className="muted">Contact details will appear here once added in the admin settings.</p>}</div></div>
      <form onSubmit={submit} className="x-form">
        <label>Name<input required value={f.name} onChange={set('name')} /></label>
        <label>Email<input required type="email" value={f.email} onChange={set('email')} /></label>
        <label>Phone<input value={f.phone} onChange={set('phone')} /></label>
        <label>Service<select value={f.service} onChange={set('service')}><option value="">Select a service</option>{SERVICES.map(x => <option key={x.name}>{x.name}</option>)}</select></label>
        <label>Message<textarea required rows="5" value={f.message} onChange={set('message')} /></label>
        <button className="x-btn pri lg" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
      </form></div></section></>)
}
