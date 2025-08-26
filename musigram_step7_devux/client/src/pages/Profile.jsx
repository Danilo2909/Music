import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
import PostCard from '../components/PostCard.jsx'
export default function Profile(){
  const { username } = useParams()
  const [profile,setProfile]=useState(null); const [posts,setPosts]=useState([])
  async function load(){ const p=await api.get('/users/'+username); setProfile(p.user); const all=await api.get('/posts'); setPosts((all.posts||[]).filter(x=>x.userId===p.user.id)) }
  useEffect(()=>{ load() },[username])
  if(!profile) return <div>Carregando...</div>
  return (<div className="space-y-4">
    <div className="flex items-center gap-4">
      <img src={profile.avatarUrl||'https://via.placeholder.com/80'} className="w-20 h-20 rounded-full object-cover" />
      <div><div className="text-xl font-bold">@{profile.username}</div><div className="text-zinc-600">{profile.name}</div></div>
    </div>
    <div className="grid gap-4">{posts.map(p=><PostCard key={p.id} post={p} onChanged={load} />)}{posts.length===0 && <div>Sem publicações ainda.</div>}</div>
  </div>)
}
