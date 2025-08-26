import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import PostCard from '../components/PostCard.jsx'
export default function Explore(){
  const [posts,setPosts]=useState([]); const [tag,setTag]=useState(''); const [loading,setLoading]=useState(false)
  async function loadTrending(){ setLoading(true); const r=await api.get('/explore/trending'); setPosts(r.posts||[]); setLoading(false) }
  async function loadTag(t){ setLoading(true); const r=await api.get('/explore/tag/'+encodeURIComponent(t)); setPosts(r.posts||[]); setLoading(false) }
  useEffect(()=>{ loadTrending() },[])
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Explorar</h1>
    <div className="flex gap-2"><input value={tag} onChange={e=>setTag(e.target.value)} placeholder="#hashtag" className="border rounded-xl px-3 py-2"/><button onClick={()=>tag.trim()?loadTag(tag.replace(/^#/,'').trim()):loadTrending()} className="px-3 py-2 rounded-xl border">Buscar</button></div>
    {loading&&<div>Carregando...</div>}
    <div className="grid gap-4">{posts.map(p=><PostCard key={p.id} post={p} onChanged={()=>tag?loadTag(tag):loadTrending()} />)}</div></div>)
}
