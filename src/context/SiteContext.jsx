import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, configured } from '../lib/supabase'
const Ctx = createContext({ settings: {}, content: {} })
export const useSite = () => useContext(Ctx)
export function SiteProvider({ children }) {
  const [settings, setSettings] = useState({})
  const [content, setContent] = useState({})
  async function load() {
    if (!configured) return
    const [s, c] = await Promise.all([
      supabase.from('site_settings').select('*').order('created_at').limit(1).maybeSingle(),
      supabase.from('site_content').select('*')])
    if (s.data) setSettings(s.data)
    if (c.data) setContent(Object.fromEntries(c.data.map(r => [r.section_key, r])))
  }
  useEffect(() => {
    load()
    if (!configured) return
    // Live updates: admin edits show on the website instantly
    const ch = supabase.channel('site-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, load)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])
  return <Ctx.Provider value={{ settings, content, reload: load }}>{children}</Ctx.Provider>
}
