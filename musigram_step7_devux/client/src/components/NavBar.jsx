import { Link, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
export default function NavBar(){
  const { user, logout } = useAuth(); const nav=useNavigate()
  return (<div className="border-b bg-white">
    <div className="container-app px-3 py-2 flex items-center justify-between">
      <Link to="/" className="font-bold text-xl">MusiGram</Link>
      <div className="flex items-center gap-3">
        {user && (<>
          <Link to="/explore" className="px-3 py-1.5 rounded-xl border text-sm">Explorar</Link>
          <Link to="/upload" className="px-3 py-1.5 rounded-xl bg-black text-white text-sm">Novo Post</Link>
          <Link to="/dm" className="px-3 py-1.5 rounded-xl border text-sm">DM</Link>
          <NotificationBell />
          <Link to="/stories" className="px-3 py-1.5 rounded-xl border text-sm">Stories</Link>
          <Link to="/saves" className="px-3 py-1.5 rounded-xl border text-sm">Salvos</Link>
          <Link to="/playlists" className="px-3 py-1.5 rounded-xl border text-sm">Playlists</Link>
          <Link to="/support" className="px-3 py-1.5 rounded-xl border text-sm">Apoiar</Link>
          <Link to="/pro" className="px-3 py-1.5 rounded-xl border text-sm">Pro</Link>
          <Link to={`/u/${user.username}`} className="text-sm">@{user.username}</Link>
          <button onClick={()=>{logout(); nav('/login')}} className="text-sm underline">Sair</button>
        {user?.isAdmin && (<><Link to="/admin" className="px-3 py-1.5 rounded-xl border text-sm">Admin</Link><Link to="/admin/ads" className="px-3 py-1.5 rounded-xl border text-sm">Ads</Link></>)}
          </>)}
      </div>
    </div>
  </div>)
}
