import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute({ children }) {
  const { session, isAdmin, loading } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="center-screen"><div className="spinner" /></div>
  if (!session || !isAdmin) return <Navigate to="/admin/login" state={{ from: loc, denied: Boolean(session) }} replace />
  return children
}
