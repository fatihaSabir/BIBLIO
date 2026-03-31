import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnexion réussie.')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{
        background: '#1e3a8a',
        color: 'white',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: '700', fontSize: '18px' }}>📚 Bibliothèque</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAdmin && (
            <button
              onClick={() => navigate('/admin/livres')}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Gestion des livres
            </button>
          )}
          <span style={{ fontSize: '14px', opacity: 0.8 }}>{user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: '6px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Message de bienvenue */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '28px', color: '#1e3a8a', marginBottom: '8px' }}>
            Bienvenue, {user?.name} !
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Vous êtes connecté en tant que{' '}
            <strong style={{ color: user?.role === 'admin' ? '#7c3aed' : '#2563eb' }}>
              {user?.role === 'admin' ? 'Administrateur' : 'Lecteur'}
            </strong>
          </p>
        </div>

        {/* Infos utilisateur */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
            Informations du compte
          </h2>
          <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                ['Nom',    user?.name],
                ['Email',  user?.email],
                ['Rôle',   user?.role === 'admin' ? 'Administrateur' : 'Lecteur'],
                ['Statut', user?.is_active ? 'Actif' : 'Inactif'],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 0', color: '#6b7280', width: '40%' }}>{label}</td>
                  <td style={{ padding: '10px 0', color: '#111827', fontWeight: '500' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
