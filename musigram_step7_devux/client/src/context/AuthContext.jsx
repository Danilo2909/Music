import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api.js'
const Ctx=createContext(null)
export function AuthProvider({children}){
  const [user,setUser]=useState(null); const [token,setToken]=useState(localStorage.getItem('token')||'')
  useEffect(()=>{ if(!token) return; (async()=>{ const me=await api.get('/auth/me'); if(me?.user) setUser(me.user); else { setUser(null); setToken(''); localStorage.removeItem('token') } })() },[token])
  function login(tok,usr){ setToken(tok); localStorage.setItem('token',tok); setUser(usr) }
  function logout(){ setUser(null); setToken(''); localStorage.removeItem('token') }
  return <Ctx.Provider value={{ user, token, login, logout, setUser }}>{children}</Ctx.Provider>
}
export function useAuth(){ return useContext(Ctx) }
