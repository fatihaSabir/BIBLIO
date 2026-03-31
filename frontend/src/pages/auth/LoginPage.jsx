import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Eye, EyeOff, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors]   = useState({})

  // Mettre à jour un champ du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur du champ modifié
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validation côté client
    const newErrors = {}
    if (!form.email)    newErrors.email    = 'L\'email est obligatoire.'
    if (!form.password) newErrors.password = 'Le mot de passe est obligatoire.'
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // Appel à l'API login
      const user = await login(form.email, form.password)
      toast.success('Connexion réussie ! Bienvenue ' + user.name)

      // Redirection selon le rôle
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/lecteur')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur de connexion.'
      setErrors({ general: message })
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-blue-700 mb-3">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">Bibliothèque</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="text-gray-500 text-sm mt-1">
            Accédez à votre espace personnel
          </p>
        </div>

        {/* Message d'erreur général */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Champ Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={`input pl-9 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`input pl-9 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Comptes de test */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
          <p className="font-medium mb-1">Comptes de test :</p>
          <p>Admin : admin@bibliotheque.ma / Admin@1234</p>
          <p>Lecteur : karim@example.com / password</p>
        </div>

        {/* Lien inscription */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            S'inscrire gratuitement
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          <Link to="/" className="hover:text-blue-600">
            ← Retour à l'accueil
          </Link>
        </p>

      </div>
    </div>
  )
}
