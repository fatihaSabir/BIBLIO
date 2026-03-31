import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { BookOpen, Eye, EyeOff, User, Mail, Lock, Phone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm] = useState({
    name:                  '',
    email:                 '',
    password:              '',
    password_confirmation: '',
    phone:                 '',
    address:               '',
  })
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [errors, setErrors]   = useState({})

  // Mettre à jour un champ
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validation côté client
    const newErrors = {}
    if (!form.name)     newErrors.name     = 'Le nom est obligatoire.'
    if (!form.email)    newErrors.email    = 'L\'email est obligatoire.'
    if (!form.password) newErrors.password = 'Le mot de passe est obligatoire.'
    if (form.password.length < 8) newErrors.password = 'Minimum 8 caractères.'
    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas.'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      await register(form)
      toast.success('Inscription réussie ! Bienvenue !')
      navigate('/lecteur')
    } catch (error) {
      // Erreurs de validation Laravel
      const laravelErrors = error.response?.data?.errors
      if (laravelErrors) {
        const formatted = {}
        Object.entries(laravelErrors).forEach(([key, messages]) => {
          formatted[key] = messages[0]
        })
        setErrors(formatted)
      } else {
        const message = error.response?.data?.message || 'Erreur lors de l\'inscription.'
        setErrors({ general: message })
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700 mb-3">
            <BookOpen className="w-8 h-8" />
            <span className="text-xl font-bold">Bibliothèque</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">
            Inscrivez-vous pour emprunter des livres
          </p>
        </div>

        {/* Erreur générale */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Votre nom complet"
                className={`input pl-9 ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                className={`input pl-9 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 caractères"
                className={`input pl-9 pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPwd ? 'text' : 'password'}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Répétez le mot de passe"
                className={`input pl-9 ${errors.password_confirmation ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          {/* Téléphone (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="0612345678"
                className="input pl-9"
              />
            </div>
          </div>

          {/* Adresse (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse <span className="text-gray-400 text-xs">(optionnel)</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Votre adresse"
                className="input pl-9"
              />
            </div>
          </div>

          {/* Bouton inscription */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Inscription en cours...
              </span>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        {/* Lien connexion */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Se connecter
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
