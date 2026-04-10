import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'
import toast from 'react-hot-toast'

const inputStyle = {
  width:'100%', border:'1px solid #d1d5db', borderRadius:'8px',
  padding:'9px 12px', fontSize:'14px', outline:'none',
  boxSizing:'border-box', marginBottom:'12px',
}

export default function AdminBooks() {
  const [livres,      setLivres]      = useState([])
  const [categories,  setCategories]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [showForm,    setShowForm]    = useState(false)
  const [editLivre,   setEditLivre]   = useState(null)
  const [erreur,      setErreur]      = useState('')
  const [recherche,   setRecherche]   = useState('')

  const [form, setForm] = useState({
    title:'', author:'', isbn:'', description:'',
    category_id:'', total_copies:1, published_year:'', publisher:'',
  })

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  // Charger données
  useEffect(() => {
    charger()
  }, [])

  const charger = async () => {
    setLoading(true)
    try {
      const [livresRes, catsRes] = await Promise.all([
        api.get('/books?per_page=50'),
        api.get('/categories'),
      ])
      setLivres(livresRes.data.data ?? [])
      setCategories(catsRes.data)
    } catch {
      toast.error('Erreur de chargement.')
    } finally {
      setLoading(false)
    }
  }

  // Ouvrir formulaire (ajout ou édition)
  const ouvrirForm = (livre = null) => {
    setErreur('')
    if (livre) {
      setEditLivre(livre)
      setForm({
        title:          livre.title          ?? '',
        author:         livre.author         ?? '',
        isbn:           livre.isbn           ?? '',
        description:    livre.description    ?? '',
        category_id:    livre.category_id    ?? '',
        total_copies:   livre.total_copies   ?? 1,
        published_year: livre.published_year ?? '',
        publisher:      livre.publisher      ?? '',
      })
    } else {
      setEditLivre(null)
      setForm({ title:'', author:'', isbn:'', description:'', category_id:'', total_copies:1, published_year:'', publisher:'' })
    }
    setShowForm(true)
  }

  const fermerForm = () => { setShowForm(false); setEditLivre(null); setErreur('') }

  // Ajouter ou Modifier
  const handleSave = async (e) => {
    e.preventDefault()
    setErreur('')

    if (!form.title.trim())  { setErreur('Le titre est obligatoire.'); return }
    if (!form.author.trim()) { setErreur('L\'auteur est obligatoire.'); return }
    if (!form.total_copies || form.total_copies < 1) { setErreur('Au moins 1 exemplaire.'); return }

    try {
      if (editLivre) {
        const res = await api.put(`/books/${editLivre.id}`, form)
        toast.success('Livre modifié avec succès !')
        setLivres(prev => prev.map(l => l.id === editLivre.id ? res.data.book : l))
      } else {
        const res = await api.post('/books', {
          ...form,
          available_copies: form.total_copies,
        })
        toast.success('Livre ajouté avec succès !')
        setLivres(prev => [res.data.book, ...prev])
      }
      fermerForm()
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) setErreur(Object.values(errors).flat()[0])
      else setErreur(err.response?.data?.message || 'Erreur.')
    }
  }

  // Supprimer
  const handleDelete = async (livre) => {
    if (!window.confirm(`Supprimer "${livre.title}" ?`)) return
    try {
      await api.delete(`/books/${livre.id}`)
      toast.success('Livre supprimé.')
      setLivres(prev => prev.filter(l => l.id !== livre.id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  // Filtrer par recherche
  const livresFiltres = livres.filter(l =>
    l.title.toLowerCase().includes(recherche.toLowerCase()) ||
    l.author.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc' }}>
      <Navbar />

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px 24px' }}>

        {/* En-tête */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
          <h1 style={{ fontSize:'22px', fontWeight:'700', color:'#1e3a8a', margin:0 }}>
            📖 Gestion des livres ({livresFiltres.length})
          </h1>
          <button onClick={() => ouvrirForm()} style={{
            background:'#2563eb', color:'white', border:'none',
            borderRadius:'8px', padding:'10px 20px', cursor:'pointer',
            fontWeight:'600', fontSize:'14px',
          }}>
            + Ajouter un livre
          </button>
        </div>

        {/* Recherche */}
        <input
          type="text"
          placeholder="🔍 Rechercher par titre ou auteur..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{ ...inputStyle, marginBottom:'20px', padding:'10px 16px' }}
        />

        {/* Modal formulaire */}
        {showForm && (
          <div style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.5)',
            display:'flex', alignItems:'center', justifyContent:'center',
            zIndex:1000, padding:'16px',
          }}>
            <div style={{
              background:'white', borderRadius:'16px', padding:'28px',
              width:'100%', maxWidth:'560px', maxHeight:'90vh', overflowY:'auto',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <h2 style={{ margin:0, fontSize:'18px', color:'#1e3a8a' }}>
                  {editLivre ? '✏️ Modifier le livre' : '➕ Ajouter un livre'}
                </h2>
                <button onClick={fermerForm} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#6b7280' }}>✕</button>
              </div>

              {erreur && (
                <div style={{ background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:'8px', padding:'12px', marginBottom:'16px', fontSize:'14px' }}>
                  {erreur}
                </div>
              )}

              <form onSubmit={handleSave}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>

                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Titre *</label>
                    <input type="text" value={form.title} onChange={set('title')} placeholder="Titre du livre" style={inputStyle} />
                  </div>

                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Auteur *</label>
                    <input type="text" value={form.author} onChange={set('author')} placeholder="Auteur" style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>ISBN</label>
                    <input type="text" value={form.isbn} onChange={set('isbn')} placeholder="978-..." style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Catégorie</label>
                    <select value={form.category_id} onChange={set('category_id')} style={inputStyle}>
                      <option value="">— Sélectionner —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Exemplaires *</label>
                    <input type="number" value={form.total_copies} onChange={set('total_copies')} min="1" max="100" style={inputStyle} />
                  </div>

                  <div>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Année publication</label>
                    <input type="number" value={form.published_year} onChange={set('published_year')} placeholder="ex: 2020" min="1900" max="2025" style={inputStyle} />
                  </div>

                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Éditeur</label>
                    <input type="text" value={form.publisher} onChange={set('publisher')} placeholder="Éditeur" style={inputStyle} />
                  </div>

                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontSize:'13px', fontWeight:'500', color:'#374151', display:'block', marginBottom:'4px' }}>Description</label>
                    <textarea value={form.description} onChange={set('description')} placeholder="Résumé..." rows={3} style={{ ...inputStyle, resize:'vertical' }} />
                  </div>

                </div>

                <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'8px' }}>
                  <button type="button" onClick={fermerForm} style={{ background:'#f3f4f6', color:'#374151', border:'1px solid #d1d5db', borderRadius:'8px', padding:'10px 20px', cursor:'pointer', fontWeight:'500' }}>
                    Annuler
                  </button>
                  <button type="submit" style={{ background:'#2563eb', color:'white', border:'none', borderRadius:'8px', padding:'10px 24px', cursor:'pointer', fontWeight:'600', fontSize:'14px' }}>
                    {editLivre ? 'Enregistrer' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tableau */}
        <div style={{ background:'white', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'60px', color:'#6b7280' }}>Chargement...</div>
          ) : livresFiltres.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', color:'#6b7280' }}>
              {recherche ? 'Aucun livre trouvé.' : 'Aucun livre. Cliquez sur "+ Ajouter un livre".'}
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
                  {['Titre','Auteur','Catégorie','Exemplaires','Statut','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#6b7280', textTransform:'uppercase', letterSpacing:'0.05em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {livresFiltres.map(livre => (
                  <tr key={livre.id} style={{ borderBottom:'1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ fontWeight:'500', color:'#111827' }}>{livre.title}</div>
                      {livre.isbn && <div style={{ fontSize:'11px', color:'#9ca3af' }}>ISBN: {livre.isbn}</div>}
                    </td>
                    <td style={{ padding:'12px 16px', color:'#6b7280' }}>{livre.author}</td>
                    <td style={{ padding:'12px 16px', color:'#6b7280' }}>{livre.category?.name ?? '—'}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{ fontWeight:'600', color: livre.available_copies > 0 ? '#059669' : '#dc2626' }}>
                        {livre.available_copies}
                      </span>
                      <span style={{ color:'#9ca3af' }}> / {livre.total_copies}</span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{
                        display:'inline-block', padding:'3px 10px', borderRadius:'20px',
                        fontSize:'12px', fontWeight:'500',
                        background: livre.is_available ? '#d1fae5' : '#fee2e2',
                        color:      livre.is_available ? '#065f46' : '#991b1b',
                      }}>
                        {livre.is_available ? 'Disponible' : 'Indisponible'}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => ouvrirForm(livre)} style={{
                          background:'#dbeafe', color:'#1d4ed8', border:'none',
                          borderRadius:'6px', padding:'5px 12px', cursor:'pointer', fontSize:'12px', fontWeight:'500',
                        }}>
                          Modifier
                        </button>
                        <button onClick={() => handleDelete(livre)} style={{
                          background:'#fee2e2', color:'#991b1b', border:'none',
                          borderRadius:'6px', padding:'5px 12px', cursor:'pointer', fontSize:'12px', fontWeight:'500',
                        }}>
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}
