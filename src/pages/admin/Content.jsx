import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useSite } from '../../context/SiteContext'
import { useUI } from '../../components/ui'
const SECTIONS = [['hero', 'Homepage hero', 'Title, short line and description at the top of the homepage'], ['about', 'About section', ''], ['cta', 'Call to action', ''], ['contact', 'Contact section', ''], ['footer', 'Footer', '']]
function Editor({ k, label, row, reload }) {
  const { toast } = useUI()
  const [v, setV] = useState({ title: '', subtitle: '', content: '' }), [busy, setBusy] = useState(false)
  useEffect(() => { if (row) setV({ title: row.title || '', subtitle: row.subtitle || '', content: row.content || '' }) }, [row])
  async function save(e) {
    e.preventDefault(); setBusy(true)
    const { error } = await supabase.from('site_content').upsert({ section_key: k, ...v, updated_at: new Date().toISOString() }, { onConflict: 'section_key' })
    setBusy(false)
    if (error) return toast(error.message, 'err')
    toast(`${label} saved`); reload()
  }
  const set = f => e => setV({ ...v, [f]: e.target.value })
  return (
    <form className="panel form" onSubmit={save}><h3>{label}</h3>
      <label>Title<input value={v.title} onChange={set('title')} /></label>
      <label>Subtitle<input value={v.subtitle} onChange={set('subtitle')} /></label>
      <label>Content<textarea rows="5" value={v.content} onChange={set('content')} /></label>
      <button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button></form>)
}
export default function Content() {
  const { content, reload } = useSite()
  return (<><h1>Website content</h1><p className="muted">Changes appear on the website as soon as you save. Leave a field empty to use the default text.</p>
    <div className="grid2">{SECTIONS.map(([k, l]) => <Editor key={k} k={k} label={l} row={content[k]} reload={reload} />)}</div></>)
}
