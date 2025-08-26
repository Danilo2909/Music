import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
export default function StoryFeed(){
  const [stories,setStories]=useState([])
  async function load(){ const r=await api.get('/stories/feed'); setStories(r.stories||[]) }
  useEffect(()=>{ load() },[])
  return (<div><h1 className="text-2xl font-bold">Stories</h1>
    <div className="flex gap-3 overflow-x-auto mt-4">{stories.map(s=>(<div key={s.id} className="border rounded-xl p-2 w-40">
      <img src={s.imageUrl||'https://via.placeholder.com/150'} className="w-full h-24 object-cover rounded-lg"/>
      <div className="text-sm">{s.caption}</div>
      <div className="text-xs text-zinc-500">{new Date(s.createdAt).toLocaleString()}</div>
    </div>))}{stories.length===0 && <div>Nenhum story.</div>}</div></div>)
}
