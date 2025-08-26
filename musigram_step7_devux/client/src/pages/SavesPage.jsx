import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import PostCard from '../components/PostCard.jsx'
export default function SavesPage(){
  const [posts,setPosts]=useState([])
  async function load(){ const r=await api.get('/saves'); setPosts(r.posts||[]) }
  useEffect(()=>{ load() },[])
  return (<div><h1 className="text-2xl font-bold">Salvos</h1>
    <div className="grid gap-4 mt-4">{posts.map(p=><PostCard key={p.id} post={p} onChanged={load}/>)}</div>
    {posts.length===0 && <div>Nenhum post salvo.</div>}
  </div>)
}
