import { useState } from 'react'
import { api } from '../lib/api.js'
export default function PostCard({ post, onChanged }){
  const [show,setShow]=useState(false); const [comments,setComments]=useState([]); const [text,setText]=useState('')
  async function toggle(){ if(!show){ const r=await api.get(`/posts/${post.id}/comments`); setComments(r.comments||[]) } setShow(!show) }
  async function like(){ try{ await api.post(`/posts/${post.id}/like`,{}); onChanged&&onChanged() }catch{ await api.del(`/posts/${post.id}/like`); onChanged&&onChanged() } }
  async function send(e){ e.preventDefault(); if(!text.trim()) return; const r=await api.post(`/posts/${post.id}/comments`,{text}); setComments([...(comments||[]), r.comment]); setText(''); onChanged&&onChanged() }
  return (<div className="bg-white border rounded-2xl overflow-hidden">
    {post.coverUrl && <img src={post.coverUrl} className="w-full h-64 object-cover" alt="cover" />}
    <div className="p-3">
      <div className="text-sm text-zinc-500">{new Date(post.createdAt).toLocaleString()}</div>
      <p className="mt-1">{post.caption}</p>
      <audio controls src={post.audioUrl} className="w-full mt-2" />
      <div className="flex gap-3 mt-3 text-sm">
        <button onClick={like} className="px-3 py-1.5 border rounded-xl">Curtir ({post.likeCount||0})</button>
        <button onClick={toggle} className="px-3 py-1.5 border rounded-xl">Comentários ({post.commentCount||0})</button>
      </div>
        <div className="flex items-center gap-2 mt-2 text-xs">
          <button onClick={async()=>{ const reason=prompt('Motivo do report?')||''; try{ await api.post('/mod/report',{ type:'post', targetId:post.id, reason }) ; alert('Report enviado') }catch(e){ alert('Erro ao reportar') } }} className="underline">Reportar</button>
        </div>
      {show && (<div className="mt-3">
        <form onSubmit={send} className="flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded-xl px-3 py-2" placeholder="Escreva um comentário..." />
          <button className="px-3 py-2 bg-black text-white rounded-xl">Enviar</button>
        </form>
        <div className="mt-2 space-y-2">{(comments||[]).map(c=>(<div key={c.id} className="text-sm"><span className="font-semibold">@{c.userId.slice(0,6)}</span> {c.text}</div>))}</div>
      </div>)}
    </div>
  </div>)
}
