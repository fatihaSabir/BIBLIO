import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import api from '../api'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users,     setUsers]     = useState([])
  const [loading,   setLoading]   = useState(true)
  const [recherche, setRecherche] = useState('')

  useEffect(() => { charger() }, [])

  const charger = async () => {
    setLoading(true)
    try {
      const res = await api.get('/users?per_page=50')
      setUsers(res.data.data ?? [])
    } catch {
      toast.error('Erreur de chargement.')
    } finally {
      setLoading(false)
    }
  }

  // Changer le rôle
  const handleRole = async (user, newRole) => {
    if (!window.confirm(`Changer le rôle de "${user.name}" vers "${newRole}" ?`)) return
    try {
      const res = await api.put(`/users/${user.id}/role`, { role: newRole })
      toast.success(res.data.message)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  // Activer / désactiver
  const handleToggle = async (user) => {
    try {
      const res = await api.post(`/users/${user.id}/toggle`)
      toast.success(res.data.message)
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  // Supprimer
  const handleDelete = async (user) => {
    if (!window.confirm(`Supprimer le compte de "${user.name}" ?`)) return
    try {
      await api.delete(`/users/${user.id}`)
      toast.success('Utilisateur supprimé.')
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur.')
    }
  }

  const usersFiltres = users.filter(u =>
    u.name.toLowerCase().includes(recherche.toLowerCase()) ||
    u.email.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc' }}>
      <Navbar />

      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'32px 24px' }}>

        <h1 style={{ fontSize:'22px', fontWeight:'700', color:'#1e3a8a', marginBottom:'24px' }}>
          👥 Gestion des utilisateurs & rôles ({usersFiltres.length})
        </h1>

        {/* Recherche */}
        <input
          type="text"
          placeholder="🔍 Rechercher par nom ou email..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          style={{
            width:'100%', border:'1px solid #d1d5db', borderRadius:'8px',
            padding:'10px 16px', fontSize:'14px', outline:'none',
            boxSizing:'border-box', marginBottom:'20px',
          }}
        />

        <div style={{ background:'white', borderRadius:'12px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:'60px', color:'#6b7280' }}>Chargement...</div>
          ) : usersFiltres.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px', color:'#6b7280' }}>Aucun utilisateur trouvé.</div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'2px solid #e5e7eb' }}>
                  {['Utilisateur','Email','Rôle','Statut','Actions'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'12px', fontWeight:'600', color:'#6b7280', textTransform:'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersFiltres.map(user => (
                  <tr key={user.id} style={{ borderBottom:'1px solid #f3f4f6' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <div style={{
                          width:'36px', height:'36px', borderRadius:'50%', flexShrink:0,
                          background: user.role === 'admin' ? '#ede9fe' : '#dbeafe',
                          color:      user.role === 'admin' ? '#6d28d9'  : '#1d4ed8',
                          display:'flex', alignItems:'center', justifyContent:'center',
                          fontWeight:'700', fontSize:'14px',
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight:'500', color:'#111827' }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 16px', color:'#6b7280' }}>{user.email}</td>
                    <td style={{ padding:'12px 16px' }}>
                      <select
                        value={user.role}
                        onChange={e => handleRole(user, e.target.value)}
                        style={{
                          border:'1px solid #d1d5db', borderRadius:'6px',
                          padding:'4px 8px', fontSize:'13px', cursor:'pointer',
                          background: user.role === 'admin' ? '#ede9fe' : '#f3f4f6',
                          color:      user.role === 'admin' ? '#6d28d9'  : '#374151',
                          fontWeight:'500',
                        }}
                      >
                        <option value="lecteur">Lecteur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <span style={{
                        display:'inline-block', padding:'3px 10px', borderRadius:'20px',
                        fontSize:'12px', fontWeight:'500',
                        background: user.is_active ? '#d1fae5' : '#fee2e2',
                        color:      user.is_active ? '#065f46' : '#991b1b',
                      }}>
                        {user.is_active ? 'Actif' : 'Désactivé'}
                      </span>
                    </td>
                    <td style={{ padding:'12px 16px' }}>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={() => handleToggle(user)} style={{
                          background: user.is_active ? '#fef3c7' : '#d1fae5',
                          color:      user.is_active ? '#92400e' : '#065f46',
                          border:'none', borderRadius:'6px', padding:'5px 12px',
                          cursor:'pointer', fontSize:'12px', fontWeight:'500',
                        }}>
                          {user.is_active ? 'Désactiver' : 'Activer'}
                        </button>
                        <button onClick={() => handleDelete(user)} style={{
                          background:'#fee2e2', color:'#991b1b', border:'none',
                          borderRadius:'6px', padding:'5px 12px', cursor:'pointer',
                          fontSize:'12px', fontWeight:'500',
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
