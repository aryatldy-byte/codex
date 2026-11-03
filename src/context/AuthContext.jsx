import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  async function check(s) {
    setSession(s)
    if (!s) { setIsAdmin(false); return setLoading(false) }
    const { data } = await supabase.from('admin_users').select('user_id').eq('user_id', s.user.id).maybeSingle()
    setIsAdmin(Boolean(data)); setLoading(false)
  }
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => check(data.session)).catch(() => setLoading(false))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setTimeout(() => check(s), 0) })
    return () => sub.subscription.unsubscribe()
  }, [])
  const login = (email, password) => supabase.auth.signInWithPassword({ email, password })
  const logout = () => supabase.auth.signOut()
  return <Ctx.Provider value={{ session, user: session?.user, isAdmin, loading, login, logout }}>{children}</Ctx.Provider>
}
