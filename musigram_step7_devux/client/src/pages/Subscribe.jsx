import { useState } from 'react'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
export default function Subscribe(){
  const [plan,setPlan]=useState('monthly')
  const { user } = useAuth()
  async function go(){ const r=await api.post('/payments/create-subscription-session',{ plan }); window.location = r.url }
  return (<div>
    <h1 className="text-2xl font-bold">MusiGram Pro</h1>
    <div className="mt-2 text-zinc-600 text-sm">Status: <b>{user?.isPro ? 'Ativo' : 'Free'}</b></div>
    <div className="mt-4 flex gap-2">
      <button onClick={()=>setPlan('monthly')} className={`px-3 py-2 rounded-xl border ${plan==='monthly'?'bg-zinc-900 text-white':''}`}>Mensal</button>
      <button onClick={()=>setPlan('yearly')} className={`px-3 py-2 rounded-xl border ${plan==='yearly'?'bg-zinc-900 text-white':''}`}>Anual</button>
    </div>
    <button onClick={go} className="mt-4 px-4 py-2 rounded-xl bg-black text-white">Assinar via Stripe</button>
  </div>)
}
