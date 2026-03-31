import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Instance axios configurée
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Ajouter le token à chaque requête automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Vérifier si un token existe au démarrage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/me')
        .then(res => {
          setUser(res.data.user ?? res.data)
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Connexion
  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  // Inscription
  const register = async (data) => {
    const res = await api.post('/register', data)
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    return res.data.user
  }

  // Déconnexion
  const logout = async () => {
    try { await api.post('/logout') } catch {}
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin:   user?.role === 'admin',
      isLecteur: user?.role === 'lecteur',
      api,   // exposer api pour utilisation dans les pages
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être dans AuthProvider')
  return ctx
}

export { api }
