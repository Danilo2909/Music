import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import PostCard from '../components/PostCard.jsx'
export default function Feed(){
  const [posts,setPosts]=useState([]); const [loading,setLoading]=useState(true); const [offset,setOffset]=useState(0); const [total,setTotal]=useState(0)
  async function load(reset=false){ setLoading(true); try{ const r=await api.get(`/posts/feed?offset=${reset?0:offset}&limit=10`); setPosts(p=>reset?(r.posts||[]):[...p,...(r.posts||[])]); setTotal(r.total||0); setOffset(o=>reset?10:o+10) } finally{ setLoading(false) } }
  useEffect(()=>{ load(true) },[])
  return (<div className="space-y-4"><h1 className="text-2xl font-bold">Feed</h1>{loading&&<div>Carregando...</div>}{posts.map(p=><PostCard key={p.id} post={p} onChanged={()=>load(true)} />)}{posts.length<total && !loading && <div className="flex justify-center"><button onClick={()=>load(false)} className="px-4 py-2 rounded-xl border">Carregar mais</button></div>}</div>)
}
