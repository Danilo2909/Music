import { Router } from 'express'
import { db } from '../utils/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendMail } from '../utils/email.js'
import { v4 as uuidv4 } from 'uuid'
import { v4 as uuid } from 'uuid'
const router = Router()

router.post('/register', async (req,res)=>{
  const { name, username, email, password } = req.body
  if(!name||!username||!email||!password) return res.status(400).json({error:'Missing'})
  const data = db.get()
  data.emailTokens = data.emailTokens||[]; data.resetTokens = data.resetTokens||[];
  if (data.users.find(u=>u.email===email || u.username===username)) return res.status(400).json({error:'Já existe'})
  const passwordHash = await bcrypt.hash(password, 10)
  const user = { id: uuid(), name, username, email, passwordHash, bio:'', avatarUrl:'', createdAt: Date.now(), isAdmin:false, isBanned:false, shadowbanned:false }
  data.users.push(user); data.emailTokens=data.emailTokens||[]; const token=uuidv4(); data.emailTokens.push({ token, userId:user.id, createdAt:Date.now() }); db.set(()=>data); try{ await sendMail({ to: email, subject:'Verifique seu e-mail', html:`Clique para verificar: <a href="${(process.env.APP_PUBLIC_URL||'http://localhost:5173')}/verify?token=${'${token}'}">verificar</a>` }) }catch{}
  const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET||'dev', { expiresIn:'7d' })
  res.json({ token, user: { id:user.id, name, username, email, bio:user.bio, avatarUrl:user.avatarUrl, isAdmin:user.isAdmin||false, isPro:user.isPro||false } })
})

router.post('/login', async (req,res)=>{
  const { emailOrUsername, password } = req.body
  const data = db.get()
  data.emailTokens = data.emailTokens||[]; data.resetTokens = data.resetTokens||[];
  const user = data.users.find(u=>u.email===emailOrUsername || u.username===emailOrUsername)
  if(!user) return res.status(401).json({error:'Inválido'})
  const ok = await bcrypt.compare(password, user.passwordHash||'')
  if(!ok) return res.status(401).json({error:'Inválido'})
  const token = jwt.sign({ id:user.id }, process.env.JWT_SECRET||'dev', { expiresIn:'7d' })
  res.json({ token, user: { id:user.id, name:user.name, username:user.username, email:user.email, bio:user.bio, avatarUrl:user.avatarUrl, isAdmin:user.isAdmin||false, isPro:user.isPro||false } })
})

router.get('/me', (req,res)=>{
  const a=req.headers.authorization||''; const t=a.startsWith('Bearer ')?a.slice(7):null
  if(!t) return res.json({ user: null })
  try{
    const p=jwt.verify(t, process.env.JWT_SECRET||'dev')
    const data=db.get(); const u=data.users.find(x=>x.id===p.id)
    if(!u) return res.json({ user: null })
    res.json({ user: { id:u.id, name:u.name, username:u.username, email:u.email, bio:u.bio, avatarUrl:u.avatarUrl, isAdmin:u.isAdmin||false, isPro:u.isPro||false } })
  }catch{ res.json({ user: null }) }
})

export default router


router.get('/verify', async (req,res)=>{
  const { token } = req.query
  const data = db.get(); data.emailTokens=data.emailTokens||[]
  const t = data.emailTokens.find(x=>x.token===token)
  if(!t) return res.status(400).json({error:'Token inválido'})
  const u = data.users.find(x=>x.id===t.userId); if(!u) return res.status(404).json({error:'Usuário não encontrado'})
  u.emailVerified = true
  data.emailTokens = data.emailTokens.filter(x=>x.token!==token)
  db.set(()=>data)
  res.json({ ok:true })
})

router.post('/reset/request', async (req,res)=>{
  const { email } = req.body
  const data = db.get(); data.resetTokens=data.resetTokens||[]
  const u = data.users.find(x=>x.email===email)
  if(u){ const token = (Math.random().toString(36).slice(2)+Date.now()); data.resetTokens.push({ token, userId:u.id, createdAt:Date.now() }); db.set(()=>data); try{ await sendMail({ to: email, subject:'Reset de senha', html:`Token: ${'${token}'}` }) }catch{} }
  res.json({ ok:true })
})

router.post('/reset/confirm', async (req,res)=>{
  const { token, newPassword } = req.body
  const data=db.get(); data.resetTokens=data.resetTokens||[]
  const t = data.resetTokens.find(x=>x.token===token)
  if(!t) return res.status(400).json({error:'Token inválido'})
  const u = data.users.find(x=>x.id===t.userId)
  if(!u) return res.status(404).json({error:'Usuário não encontrado'})
  const bcrypt = (await import('bcryptjs')).default
  u.passwordHash = await bcrypt.hash(newPassword, 10)
  data.resetTokens = data.resetTokens.filter(x=>x.token!==token)
  db.set(()=>data)
  res.json({ ok:true })
})
