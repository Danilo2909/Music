import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { Link } from 'react-router-dom'
export default function DMInbox(){
  const [list,setList]=useState([])
  async function load(){ const r=await api.get('/dm/conversations'); setList(r.conversations||[]) }
  useEffect(()=>{ load() },[])
  return (<div><h1 className="text-2xl font-bold">Mensagens</h1>
    <div className="mt-4 space-y-2">
      {list.map(c=>(<Link key={c.id} to={`/dm/${c.id}`} className="block border rounded-xl p-3 hover:bg-zinc-50">
        <div className="text-sm text-zinc-600">Atualizado: {new Date(c.updatedAt||c.createdAt).toLocaleString()}</div>
        <div className="text-sm">Conversa: {c.id.slice(0,8)}...</div>
      </Link>))}
      {list.length===0 && <div>Sem conversas ainda.</div>}
    </div>
  </div>)
}
