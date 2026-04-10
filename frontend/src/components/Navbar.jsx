import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnexion réussie.')
    navigate('/login')
  }

  return (
    <nav style={{
      background:     '#1e3a8a',
      color:          'white',
      padding:        '0 24px',
      height:         '60px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      position:       'sticky',
      top:            0,
      zIndex:         100,
    }}>
      {/* Logo */}
      <Link to={isAdmin ? '/admin/livres' : '/dashboard'}
        style={{ color:'white', textDecoration:'none', fontWeight:'700', fontSize:'18px' }}>
        📚 Bibliothèque
      </Link>

      {/* Navigation */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        {isAdmin && (
          <>
            <NavBtn to="/admin/livres">Livres</NavBtn>
            <NavBtn to="/admin/utilisateurs">Utilisateurs</NavBtn>
          </>
        )}
        {!isAdmin && (
          <NavBtn to="/dashboard">Mon espace</NavBtn>
        )}

        {/* Badge rôle */}
        <span style={{
          background:   user?.role === 'admin' ? '#7c3aed' : '#2563eb',
          padding:      '3px 10px',
          borderRadius: '20px',
          fontSize:     '12px',
          fontWeight:   '600',
          marginLeft:   '8px',
        }}>
          {user?.role === 'admin' ? 'Admin' : 'Lecteur'}
        </span>

        <span style={{ fontSize:'14px', opacity:0.8, marginLeft:'8px' }}>
          {user?.name}
        </span>

        <button onClick={handleLogout} style={{
          background:   'transparent',
          color:        'white',
          border:       '1px solid rgba(255,255,255,0.4)',
          borderRadius: '6px',
          padding:      '6px 14px',
          cursor:       'pointer',
          fontSize:     '13px',
          marginLeft:   '8px',
        }}>
          Déconnexion
        </button>
      </div>
    </nav>
  )
}

function NavBtn({ to, children }) {
  return (
    <Link to={to} style={{
      color:          'white',
      textDecoration: 'none',
      padding:        '6px 14px',
      borderRadius:   '6px',
      fontSize:       '13px',
      background:     'rgba(255,255,255,0.1)',
    }}
    onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.2)'}
    onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
    >
      {children}
    </Link>
  )
}
