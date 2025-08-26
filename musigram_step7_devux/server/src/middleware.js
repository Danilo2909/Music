import jwt from 'jsonwebtoken'
import { db } from './utils/db.js'
export function requireAuth(req,res,next){
  const a=req.headers.authorization||''; const t=a.startsWith('Bearer ')?a.slice(7):null
  if(!t) return res.status(401).json({error:'No token'})
  try{ const p=jwt.verify(t, process.env.JWT_SECRET||'dev'); const data=db.get(); const u=data.users.find(x=>x.id===p.id); if(!u) return res.status(401).json({error:'Invalid token'}); if(u.isBanned) return res.status(403).json({error:'User banned'}); req.user={ id:u.id }; next() }catch{ res.status(401).json({error:'Invalid token'}) }
}
