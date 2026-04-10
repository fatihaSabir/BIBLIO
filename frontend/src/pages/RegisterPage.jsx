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
    width:'100%', maxWidth:'440px', boxShadow:'0 4px 24px rgba(0,0,0,0.08)',
  },
  label: { display:'block', fontSize:'14px', fontWeight:'500', color:'#374151', marginBottom:'5px' },
  input: {
    width:'100%', border:'1px solid #d1d5db', borderRadius:'8px',
    padding:'10px 12px', fontSize:'14px', outline:'none',
    boxSizing:'border-box', marginBottom:'14px',
  },
  error: {
    background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626',
    borderRadius:'8px', padding:'12px', marginBottom:'14px', fontSize:'14px',
  },
  btn: {
    width:'100%', background:'#2563eb', color:'white', border:'none',
    borderRadius:'8px', padding:'12px', fontSize:'15px', fontWeight:'600',
    cursor:'pointer', marginTop:'8px',
  },
}

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form, setForm] = useState({
    name:'', email:'', password:'', password_confirmation:'',
  })
  const [erreur,  setErreur]  = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const focus = (e) => { e.target.style.borderColor = '#3b82f6' }
  const blur  = (e) => { e.target.style.borderColor = '#d1d5db' }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')

    if (!form.name.trim())     { setErreur('Le nom est obligatoire.'); return }
    if (!form.email.trim())    { setErreur('L\'email est obligatoire.'); return }
    if (!form.password)        { setErreur('Le mot de passe est obligatoire.'); return }
    if (form.password.length < 8) { setErreur('Le mot de passe doit avoir au moins 8 caractères.'); return }
    if (form.password !== form.password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      await register(form)
      toast.success('Inscription réussie ! Bienvenue !')
      navigate('/dashboard')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setErreur(Object.values(errors).flat()[0])
      } else {
        setErreur(err.response?.data?.message || 'Erreur lors de l\'inscription.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={S.page}>
      <div style={S.box}>

        <p style={{ textAlign:'center', fontSize:'36px', margin:'0 0 4px' }}>📚</p>
        <h1 style={{ fontSize:'22px', fontWeight:'700', color:'#1e3a8a', textAlign:'center', margin:'0 0 4px' }}>
          Créer un compte
        </h1>
        <p style={{ color:'#6b7280', fontSize:'14px', textAlign:'center', marginBottom:'24px' }}>
          Rejoignez la bibliothèque
        </p>

        {erreur && <div style={S.error}>{erreur}</div>}

        <form onSubmit={handleSubmit}>
          <label style={S.label}>Nom complet *</label>
          <input type="text" value={form.name} onChange={set('name')}
            placeholder="Votre nom" style={S.input} onFocus={focus} onBlur={blur} />

          <label style={S.label}>Email *</label>
          <input type="email" value={form.email} onChange={set('email')}
            placeholder="votre@email.com" style={S.input} onFocus={focus} onBlur={blur}
            autoComplete="email" />

          <label style={S.label}>Mot de passe * (min. 8 caractères)</label>
          <input type="password" value={form.password} onChange={set('password')}
            placeholder="••••••••" style={S.input} onFocus={focus} onBlur={blur}
            autoComplete="new-password" />

          <label style={S.label}>Confirmer le mot de passe *</label>
          <input type="password" value={form.password_confirmation}
            onChange={set('password_confirmation')}
            placeholder="••••••••" style={S.input} onFocus={focus} onBlur={blur}
            autoComplete="new-password" />

          <button type="submit" disabled={loading}
            style={{ ...S.btn, background: loading ? '#93c5fd' : '#2563eb', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#6b7280' }}>
          Déjà inscrit ?{' '}
          <Link to="/login" style={{ color:'#2563eb', fontWeight:'500' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
