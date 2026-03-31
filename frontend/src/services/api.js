import axios from 'axios'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────
// CRÉATION DE L'INSTANCE AXIOS
// ─────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',   // proxy vers http://localhost:8000/api via vite.config.js
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
  timeout: 10000, // 10 secondes max
})

// ─────────────────────────────────────────────
// INTERCEPTEUR DE REQUÊTE
// Ajoute automatiquement le token à chaque requête
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────
// INTERCEPTEUR DE RÉPONSE
// Gère les erreurs globalement
// ─────────────────────────────────────────────
api.interceptors.response.use(

  // ── Réponse réussie ──────────────────────────
  (response) => {
    return response
  },

  // ── Réponse en erreur ────────────────────────
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message

    // 400 - Mauvaise requête
    if (status === 400) {
      toast.error(message || 'Requête invalide.')
    }

    // 401 - Non authentifié → déconnecter et rediriger
    else if (status === 401) {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']

      // Rediriger vers login seulement si pas déjà sur login
      if (!window.location.pathname.includes('/login')) {
        toast.error('Session expirée. Veuillez vous reconnecter.')
        window.location.href = '/login'
      }
    }

    // 403 - Accès refusé
    else if (status === 403) {
      toast.error(message || 'Accès refusé. Permissions insuffisantes.')
    }

    // 404 - Ressource non trouvée
    else if (status === 404) {
      toast.error(message || 'Ressource introuvable.')
    }

    // 422 - Erreurs de validation Laravel
    else if (status === 422) {
      const errors = error.response?.data?.errors

      if (errors) {
        // Afficher chaque erreur de validation
        Object.values(errors).flat().forEach(e => toast.error(e))
      } else if (message) {
        toast.error(message)
      } else {
        toast.error('Données invalides. Vérifiez les champs.')
      }
    }

    // 429 - Trop de requêtes
    else if (status === 429) {
      toast.error('Trop de tentatives. Attendez un moment.')
    }

    // 500+ - Erreur serveur
    else if (status >= 500) {
      toast.error('Erreur serveur. Veuillez réessayer plus tard.')
    }

    // Pas de réponse (réseau coupé)
    else if (!error.response) {
      toast.error('Impossible de contacter le serveur. Vérifiez votre connexion.')
    }

    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────
// FONCTIONS UTILITAIRES
// ─────────────────────────────────────────────

// Définir le token après connexion
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

// Supprimer le token lors de la déconnexion
export const removeAuthToken = () => {
  localStorage.removeItem('token')
  delete api.defaults.headers.common['Authorization']
}

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export default api