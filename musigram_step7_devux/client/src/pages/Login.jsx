import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
export default function Login(){
  const { login } = useAuth(); const nav=useNavigate()
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [err,setErr]=useState('')
  async function submit(e){ e.preventDefault(); setErr(''); try{ const r=await api.post('/auth/login',{ emailOrUsername:email, password }); login(r.token, r.user); nav('/') }catch(e){ setErr(e.message) } }
  return (<div className="px-3 py-10">
    <h1 className="text-3xl font-bold">Entrar</h1>
    <form onSubmit={submit} className="mt-6 space-y-3 max-w-sm">
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail ou usuário" className="w-full border rounded-xl px-3 py-2" />
      <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Senha" className="w-full border rounded-xl px-3 py-2" />
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <button className="px-4 py-2 rounded-xl bg-black text-white">Entrar</button>
      <div className="text-sm">Não tem conta? <Link to="/register" className="underline">Criar conta</Link></div>
    </form>
  </div>)
}
