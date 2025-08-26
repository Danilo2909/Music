const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
function headers(){ const t=localStorage.getItem('token'); const h={'Content-Type':'application/json'}; if(t) h['Authorization']='Bearer '+t; return h }
async function request(p, opt={}){ const r=await fetch(BASE+p, opt); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Erro'); return d }
export const api = { get:p=>request(p,{headers:headers()}), post:(p,b)=>request(p,{method:'POST',headers:headers(),body:JSON.stringify(b)}), del:p=>request(p,{method:'DELETE',headers:headers()}) }
export const apiUpload = { post: async(p,fd)=>{ const t=localStorage.getItem('token'); const r=await fetch(BASE+p, { method:'POST', headers:t?{Authorization:'Bearer '+t}:undefined, body:fd }); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.error||'Erro'); return d } }
