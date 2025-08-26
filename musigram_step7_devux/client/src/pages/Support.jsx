import { useState } from 'react'
import { api } from '../lib/api.js'
export default function Support(){
  const [amount,setAmount]=useState(500) // R$5,00
  async function tip(e){ e.preventDefault(); const r=await api.post('/payments/create-checkout-session',{ amount }); window.location = r.url }
  return (<div><h1 className="text-2xl font-bold">Apoiar o MusiGram</h1>
    <form onSubmit={tip} className="mt-4 flex items-center gap-2">
      <span>Valor (centavos):</span>
      <input type="number" value={amount} onChange={e=>setAmount(parseInt(e.target.value||0))} className="border rounded-xl px-3 py-2 w-40"/>
      <button className="px-4 py-2 bg-black text-white rounded-xl">Pagar com Stripe</button>
    </form>
    <div className="text-sm text-zinc-600 mt-2">Mínimo: 100 centavos (R$1,00).</div>
  </div>)
}
