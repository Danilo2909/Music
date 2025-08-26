import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
export default function Register(){
  const { login } = useAuth(); const nav=useNavigate()
  const [form,setForm]=useState({ name:'', username:'', email:'', password:'' }); const [err,setErr]=useState('')
  function upd(k,v){ setForm(s=>({...s,[k]:v})) }
  async function submit(e){ e.preventDefault(); setErr(''); try{ const r=await api.post('/auth/register',form); login(r.token,r.user); nav('/') }catch(e){ setErr(e.message) } }
  return (<div className="px-3 py-10">
    <h1 className="text-3xl font-bold">Criar conta</h1>
    <form onSubmit={submit} className="mt-6 space-y-3 max-w-sm">
      <input value={form.name} onChange={e=>upd('name',e.target.value)} placeholder="Nome" className="w-full border rounded-xl px-3 py-2" />
      <input value={form.username} onChange={e=>upd('username',e.target.value)} placeholder="Usuário" className="w-full border rounded-xl px-3 py-2" />
      <input value={form.email} onChange={e=>upd('email',e.target.value)} placeholder="E-mail" className="w-full border rounded-xl px-3 py-2" />
      <input value={form.password} onChange={e=>upd('password',e.target.value)} type="password" placeholder="Senha" className="w-full border rounded-xl px-3 py-2" />
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button className="px-4 py-2 rounded-xl bg-black text-white">Criar</button>
      <div className="text-sm">Já tem conta? <Link to="/login" className="underline">Entrar</Link></div>
    </form>
  </div>)
}
