import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
export default function Admin(){
  const [reports,setReports]=useState([]); const [err,setErr]=useState('')
  async function load(){ try{ const r=await api.get('/admin/reports'); setReports(r.reports||[]) }catch(e){ setErr('Acesso negado ou erro') } }
  useEffect(()=>{ load() },[])
  async function delPost(id){ await api.del('/admin/posts/'+id); load() }
  async function ban(uid){ await api.post('/admin/users/'+uid+'/ban',{}); load() }
  async function unban(uid){ await api.post('/admin/users/'+uid+'/unban',{}); load() }
  async function shadow(uid){ await api.post('/admin/users/'+uid+'/shadowban',{}); load() }
  async function unshadow(uid){ await api.post('/admin/users/'+uid+'/unshadow',{}); load() }
  return (<div>
    <h1 className="text-2xl font-bold">Admin</h1>
    {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
    <div className="mt-4 space-y-2">
      {reports.map(r=>(<div key={r.id} className="border rounded-xl p-3 bg-white">
        <div className="text-sm">Tipo: {r.type} | Alvo: {r.targetId}</div>
        <div className="text-sm">Motivo: {r.reason||'-'}</div>
        <div className="text-xs text-zinc-500">{new Date(r.createdAt).toLocaleString()}</div>
        <div className="flex gap-2 mt-2 text-sm">
          {r.type==='post' && <button onClick={()=>delPost(r.targetId)} className="px-2 py-1 border rounded-lg">Deletar post</button>}
          <button onClick={()=>ban(r.reporterId)} className="px-2 py-1 border rounded-lg">Banir reporter</button>
          <button onClick={()=>shadow(r.reporterId)} className="px-2 py-1 border rounded-lg">Shadowban reporter</button>
          <button onClick={()=>unban(r.reporterId)} className="px-2 py-1 border rounded-lg">Unban</button>
          <button onClick={()=>unshadow(r.reporterId)} className="px-2 py-1 border rounded-lg">Unshadow</button>
        </div>
      </div>))}
      {reports.length===0 && <div>Nenhum report.</div>}
    </div>
  </div>)
}
