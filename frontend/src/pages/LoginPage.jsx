import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import toast from 'react-hot-toast'

const S = {
  page: {
    minHeight:'100vh', background:'#eff6ff',
    display:'flex', alignItems:'center', justifyContent:'center', padding:'16px',
  },
  box: {
    background:'white', borderRadius:'16px', padding:'40px',
    width:'100%', maxWidth:'420px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)',
  },
  title: { fontSize:'24px', fontWeight:'700', color:'#1e3a8a', margin:0, textAlign:'center' },
  sub:   { color:'#6b7280', marginTop:'8px', fontSize:'14px', textAlign:'center' },
  label: { display:'block', fontSize:'14px', fontWeight:'500', color:'#374151', marginBottom:'6px' },
  input: {
    width:'100%', border:'1px solid #d1d5db', borderRadius:'8px',
    padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box',
    transition:'border-color 0.2s',
  },
  error: {
    background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626',
    borderRadius:'8px', padding:'12px', marginBottom:'16px', fontSize:'14px',
  },
  btn: {
    width:'100%', background:'#2563eb', color:'white', border:'none',
    borderRadius:'8px', padding:'12px', fontSize:'15px', fontWeight:'600',
    cursor:'pointer', transition:'background 0.2s',
  },
  hint: {
    marginTop:'16px', background:'#eff6ff', borderRadius:'8px',
    padding:'12px', fontSize:'12px', color:'#1d4ed8',
  },
  link: { textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#6b7280' },
}

export default function LoginPage() {
  const { login }  = useAuth()
  const navigate   = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [erreur,   setErreur]   = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    if (!email.trim())    { setErreur('Veuillez saisir votre email.'); return }
    if (!password.trim()) { setErreur('Veuillez saisir votre mot de passe.'); return }

    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      toast.success('Connexion réussie ! Bienvenue ' + user.name)
      navigate(user.role === 'admin' ? '/admin/livres' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.email?.[0]
        || 'Email ou mot de passe incorrect.'
      setErreur(msg)
    } finally {
      setLoading(false)
    }
  }

  const focus = (e) => { e.target.style.borderColor = '#3b82f6' }
  const blur  = (e) => { e.target.style.borderColor = '#d1d5db' }

  return (
    <div style={S.page}>
      <div style={S.box}>

        {/* Logo */}
        <p style={{ textAlign:'center', fontSize:'40px', margin:'0 0 8px' }}>📚</p>
        <h1 style={S.title}>Bibliothèque</h1>
        <p style={S.sub}>Connectez-vous à votre compte</p>

        {/* Erreur */}
        {erreur && <div style={{ ...S.error, marginTop:'20px' }}>{erreur}</div>}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={{ marginTop: erreur ? '0' : '24px' }}>

          <div style={{ marginBottom:'16px' }}>
            <label style={S.label}>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={S.input}
              onFocus={focus}
              onBlur={blur}
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom:'24px' }}>
            <label style={S.label}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={S.input}
              onFocus={focus}
              onBlur={blur}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btn, background: loading ? '#93c5fd' : '#2563eb', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* Comptes test */}
        <div style={S.hint}>
          <strong>Comptes de test :</strong><br />
          Admin&nbsp;&nbsp; : admin@bibliotheque.ma / Admin@1234<br />
          Lecteur : karim@example.com / password
        </div>

        <p style={S.link}>
          Pas de compte ?{' '}
          <Link to="/register" style={{ color:'#2563eb', fontWeight:'500' }}>
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}
