import { useState } from 'react'
import { apiUpload } from '../lib/api.js'
import { useNavigate } from 'react-router-dom'
export default function Upload(){
  const [caption,setCaption]=useState(''); const [audio,setAudio]=useState(null); const [cover,setCover]=useState(null); const [err,setErr]=useState(''); const nav=useNavigate()
  async function submit(e){ e.preventDefault(); setErr(''); try{ const fd=new FormData(); fd.append('caption',caption); if(audio) fd.append('audio',audio); if(cover) fd.append('cover',cover); await apiUpload.post('/posts',fd); nav('/') }catch(e){ setErr(e.message) } }
  return (<div><h1 className="text-2xl font-bold">Novo Post</h1><form onSubmit={submit} className="mt-4 space-y-3 max-w-md">
    <textarea value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Legenda... use #hashtag" className="w-full border rounded-xl px-3 py-2" />
    <div><label className="block text-sm font-medium">Áudio</label><input type="file" accept="audio/*" onChange={e=>setAudio(e.target.files?.[0]||null)} /></div>
    <div><label className="block text-sm font-medium">Capa (opcional)</label><input type="file" accept="image/*" onChange={e=>setCover(e.target.files?.[0]||null)} /></div>
    {err && <div className="text-red-600 text-sm">{err}</div>}
    <button className="px-4 py-2 rounded-xl bg-black text-white">Publicar</button>
  </form></div>)
}
