import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const rows = [
    ['Nom',    user?.name],
    ['Email',  user?.email],
    ['Rôle',   user?.role === 'admin' ? 'Administrateur' : 'Lecteur'],
    ['Statut', user?.is_active ? 'Actif' : 'Inactif'],
  ]

  return (
    <div style={{ minHeight:'100vh', background:'#f8fafc' }}>
      <Navbar />

      <div style={{ maxWidth:'800px', margin:'0 auto', padding:'40px 24px' }}>

        {/* Bienvenue */}
        <div style={{
          background:'white', borderRadius:'16px', padding:'32px',
          boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:'24px', textAlign:'center',
        }}>
          <p style={{ fontSize:'48px', margin:'0 0 8px' }}>
            {user?.role === 'admin' ? '🛡️' : '👤'}
          </p>
          <h1 style={{ fontSize:'26px', color:'#1e3a8a', margin:'0 0 8px' }}>
            Bienvenue, {user?.name} !
          </h1>
          <span style={{
            display:'inline-block', padding:'4px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'600',
            background: user?.role === 'admin' ? '#ede9fe' : '#dbeafe',
            color:      user?.role === 'admin' ? '#6d28d9'  : '#1d4ed8',
          }}>
            {user?.role === 'admin' ? 'Administrateur' : 'Lecteur'}
          </span>
        </div>

        {/* Infos compte */}
        <div style={{ background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:'24px' }}>
          <h2 style={{ fontSize:'16px', fontWeight:'600', color:'#1e3a8a', marginTop:0, marginBottom:'16px' }}>
            Informations du compte
          </h2>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'14px' }}>
            <tbody>
              {rows.map(([label, value]) => (
                <tr key={label} style={{ borderBottom:'1px solid #f3f4f6' }}>
                  <td style={{ padding:'10px 0', color:'#6b7280', width:'40%' }}>{label}</td>
                  <td style={{ padding:'10px 0', color:'#111827', fontWeight:'500' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Raccourcis admin */}
        {isAdmin && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
            <QuickCard
              icon="📖"
              title="Gestion des livres"
              desc="Ajouter, modifier, supprimer des livres"
              color="#dbeafe"
              onClick={() => navigate('/admin/livres')}
            />
            <QuickCard
              icon="👥"
              title="Gestion des rôles"
              desc="Gérer les utilisateurs et leurs rôles"
              color="#ede9fe"
              onClick={() => navigate('/admin/utilisateurs')}
            />
          </div>
        )}

      </div>
    </div>
  )
}

function QuickCard({ icon, title, desc, color, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: color, borderRadius:'12px', padding:'20px',
        cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.boxShadow='none' }}
    >
      <p style={{ fontSize:'32px', margin:'0 0 8px' }}>{icon}</p>
      <p style={{ fontWeight:'600', fontSize:'15px', margin:'0 0 4px', color:'#1e293b' }}>{title}</p>
      <p style={{ fontSize:'13px', color:'#64748b', margin:0 }}>{desc}</p>
    </div>
  )
}
