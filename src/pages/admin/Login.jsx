import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { configured } from '../../lib/supabase'
export default function Login() {
  const { login, logout, session, isAdmin, loading } = useAuth()
  const nav = useNavigate(), loc = useLocation()
  const [email, setEmail] = useState(''), [pw, setPw] = useState(''), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />
  async function go(e) {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await login(email, pw)
    setBusy(false)
    if (error) setErr('Email or password is incorrect.'); else nav('/admin')
  }
  return (
    <div className="center-screen"><form className="login" onSubmit={go}>
      <div className="brand dark">Codex<span>Admin</span></div><h2>Admin sign in</h2>
      {!configured && <p className="alert">Add your Supabase keys to .env, then restart.</p>}
      {session && !isAdmin && !loading && <p className="alert">This account is not an admin. <button type="button" className="link" onClick={logout}>Sign out</button></p>}
      {err && <p className="alert">{err}</p>}
      <label>Email<input type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" required value={pw} onChange={e => setPw(e.target.value)} /></label>
      <p className="muted small">Your session is remembered on this device until you log out.</p>
      <button className="btn primary lg" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form></div>)
}
