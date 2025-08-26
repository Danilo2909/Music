import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api.js'
export default function DMChat(){
  const { conversationId } = useParams()
  const [messages,setMessages]=useState([]); const [text,setText]=useState('')
  async function load(){ const r=await api.get(`/dm/messages/${conversationId}`); setMessages(r.messages||[]) }
  async function send(e){ e.preventDefault(); if(!text.trim()) return; await api.post('/dm/send',{ conversationId, text }); setText(''); await load() }
  useEffect(()=>{ load() },[conversationId])
  return (<div className="flex flex-col h-[70vh]">
    <div className="flex-1 border rounded-xl p-3 overflow-y-auto bg-white">
      {messages.map(m=>(<div key={m.id} className="mb-2"><span className="font-semibold">@{m.senderId.slice(0,6)}</span>: {m.text}</div>))}
      {messages.length===0 && <div>Nenhuma mensagem ainda.</div>}
    </div>
    <form onSubmit={send} className="mt-3 flex gap-2">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Escreva uma mensagem..." className="flex-1 border rounded-xl px-3 py-2" />
      <button className="px-4 py-2 rounded-xl bg-black text-white">Enviar</button>
    </form>
  </div>)
}
