import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSite } from '../../context/SiteContext'
import { useUI } from '../../components/ui'
const F = [['company_name', 'Company name'], ['tagline', 'Tagline'], ['email', 'Contact email'], ['phone', 'Phone number'], ['address', 'Address'], ['website', 'Website'], ['facebook', 'Facebook URL'], ['linkedin', 'LinkedIn URL'], ['instagram', 'Instagram URL'], ['youtube', 'YouTube URL']]
export default function Settings() {
  const { settings, reload } = useSite(), { toast } = useUI()
  const [v, setV] = useState({}), [busy, setBusy] = useState(false)
  useEffect(() => setV(settings), [settings])
  async function save(e) {
    e.preventDefault(); setBusy(true)
    const body = Object.fromEntries(F.map(([k]) => [k, v[k] || '']))
    const { error } = v.id ? await supabase.from('site_settings').update(body).eq('id', v.id) : await supabase.from('site_settings').insert(body)
    setBusy(false)
    if (error) return toast(error.message, 'err')
    toast('Settings saved'); reload()
  }
  return (<><h1>Site settings</h1>
    <form className="panel form two-col" onSubmit={save}>
      {F.map(([k, l]) => <label key={k}>{l}<input value={v[k] || ''} onChange={e => setV({ ...v, [k]: e.target.value })} /></label>)}
      <div><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></div></form></>)
}
