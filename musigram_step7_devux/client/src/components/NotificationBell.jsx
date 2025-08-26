import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { connectSocket } from '../lib/socket.js'
export default function NotificationBell(){
  const { user } = useAuth()
  const [count,setCount] = useState(0)
  useEffect(()=>{ if(!user) return; const s=connectSocket(user.id); s.on('notification', ()=>setCount(c=>c+1)); return ()=>s.disconnect() },[user])
  return <div className="relative"><div className="px-3 py-1.5 rounded-xl border text-sm">Notificações</div>{count>0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">{count}</span>}</div>
}
