import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
export default function PlaylistsPage(){
  const [pls,setPls]=useState([]); const [name,setName]=useState('')
  async function load(){ const r=await api.get('/playlists'); setPls(r.playlists||[]) }
  async function create(e){ e.preventDefault(); if(!name.trim()) return; await api.post('/playlists',{name}); setName(''); load() }
  useEffect(()=>{ load() },[])
  return (<div><h1 className="text-2xl font-bold">Playlists</h1>
    <form onSubmit={create} className="mt-3 flex gap-2"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome da playlist" className="border rounded-xl px-3 py-2"/><button className="px-3 py-2 rounded-xl bg-black text-white">Criar</button></form>
    <div className="mt-4 space-y-2">{pls.map(p=>(<div key={p.id} className="border rounded-xl p-3"><div className="font-semibold">{p.name}</div><div className="text-xs text-zinc-500">{p.posts.length} posts</div></div>))}</div>
    {pls.length===0 && <div>Nenhuma playlist.</div>}
  </div>)
}
