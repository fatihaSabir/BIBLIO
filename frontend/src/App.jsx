import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard    from './pages/Dashboard'
import AdminBooks   from './pages/AdminBooks'
import AdminUsers   from './pages/AdminUsers'

// Route protégée : redirige vers /login si non connecté
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}>
        <p style={{ color:'#6b7280' }}>Chargement...</p>
      </div>
    )
  }

  if (!user)                               return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin')  return <Navigate to="/dashboard" replace />
  return children
}

// Route invité : redirige si déjà connecté
function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to={user.role === 'admin' ? '/admin/livres' : '/dashboard'} replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Redirection racine */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

      {/* Lecteur */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/livres"        element={<ProtectedRoute adminOnly><AdminBooks /></ProtectedRoute>} />
      <Route path="/admin/utilisateurs"  element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
