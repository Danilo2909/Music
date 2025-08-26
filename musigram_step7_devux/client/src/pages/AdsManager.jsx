import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
export default function AdsManager(){
  const [ads,setAds]=useState([])
  const [form,setForm]=useState({ imageUrl:'', link:'', budget:0 })
  function upd(k,v){ setForm(s=>({...s,[k]:v})) }
  async function load(){ const r=await api.get('/admin/ads'); setAds(r.ads||[]) }
  async function create(e){ e.preventDefault(); await api.post('/admin/ads', form); setForm({ imageUrl:'', link:'', budget:0 }); load() }
  async function toggle(id){ await api.post(`/admin/ads/${id}/toggle`,{}); load() }
  useEffect(()=>{ load() },[])
  return (<div>
    <h1 className="text-2xl font-bold">Ads Manager</h1>
    <form onSubmit={create} className="mt-4 grid gap-2 max-w-xl">
      <input value={form.imageUrl} onChange={e=>upd('imageUrl',e.target.value)} placeholder="Imagem (URL)" className="border rounded-xl px-3 py-2"/>
      <input value={form.link} onChange={e=>upd('link',e.target.value)} placeholder="Link de destino" className="border rounded-xl px-3 py-2"/>
      <input type="number" value={form.budget} onChange={e=>upd('budget',parseInt(e.target.value||0))} placeholder="Budget (impressões)" className="border rounded-xl px-3 py-2"/>
      <button className="px-4 py-2 rounded-xl bg-black text-white">Criar anúncio</button>
    </form>
    <div className="mt-6 space-y-2">
      {ads.map(a=>(<div key={a.id} className="border rounded-xl p-3 bg-white flex items-center gap-3">
        <img src={a.imageUrl} className="w-20 h-12 object-cover rounded-lg" />
        <div className="flex-1">
          <div className="text-sm">{a.link}</div>
          <div className="text-xs text-zinc-500">Budget: {a.budget} | Restante: {a.remaining??a.budget} | {a.active?'Ativo':'Pausado'}</div>
        </div>
        <button onClick={()=>toggle(a.id)} className="px-3 py-1.5 border rounded-xl text-sm">{a.active?'Pausar':'Ativar'}</button>
      </div>))}
      {ads.length===0 && <div>Nenhum anúncio.</div>}
    </div>
  </div>)
}
