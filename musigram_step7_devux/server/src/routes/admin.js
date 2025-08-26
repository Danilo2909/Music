import { Router } from 'express'
import { db } from '../utils/db.js'
import { requireAuth } from '../middleware.js'

const router=Router()
router.use(requireAuth)

function requireAdmin(req,res,next){
  const data=db.get(); const me=data.users.find(u=>u.id===req.user.id)
  if(!me?.isAdmin) return res.status(403).json({error:'Admin only'})
  next()
}

router.get('/reports', requireAdmin, (req,res)=>{
  const data=db.get(); res.json({ reports: data.reports||[] })
})

router.delete('/posts/:id', requireAdmin, (req,res)=>{
  const data=db.get()
  data.posts = data.posts.filter(p=>p.id!==req.params.id)
  data.comments = data.comments.filter(c=>c.postId!==req.params.id)
  data.likes = data.likes.filter(l=>l.postId!==req.params.id)
  db.set(()=>data); res.json({ ok:true })
})

router.post('/users/:id/ban', requireAdmin, (req,res)=>{
  const data=db.get(); const u=data.users.find(x=>x.id===req.params.id)
  if(!u) return res.status(404).json({error:'User not found'})
  u.isBanned = true; db.set(()=>data); res.json({ ok:true })
})

router.post('/users/:id/unban', requireAdmin, (req,res)=>{
  const data=db.get(); const u=data.users.find(x=>x.id===req.params.id)
  if(!u) return res.status(404).json({error:'User not found'})
  u.isBanned = false; db.set(()=>data); res.json({ ok:true })
})

router.post('/users/:id/shadowban', requireAdmin, (req,res)=>{
  const data=db.get(); const u=data.users.find(x=>x.id===req.params.id)
  if(!u) return res.status(404).json({error:'User not found'})
  u.shadowbanned = true; db.set(()=>data); res.json({ ok:true })
})

router.post('/users/:id/unshadow', requireAdmin, (req,res)=>{
  const data=db.get(); const u=data.users.find(x=>x.id===req.params.id)
  if(!u) return res.status(404).json({error:'User not found'})
  u.shadowbanned = false; db.set(()=>data); res.json({ ok:true })
})

export default router


router.get('/ads', requireAdmin, (req,res)=>{
  const data=db.get(); res.json({ ads: data.ads||[] })
})
router.post('/ads', requireAdmin, (req,res)=>{
  const { imageUrl, link, budget } = req.body
  const data=db.get(); const id=String(Date.now())
  const ad = { id, imageUrl, link, budget: Number(budget||0), remaining: Number(budget||0), active: true, createdAt: Date.now() }
  data.ads = data.ads||[]; data.ads.push(ad); db.set(()=>data)
  res.json({ ad })
})
router.post('/ads/:id/toggle', requireAdmin, (req,res)=>{
  const data=db.get(); const a=(data.ads||[]).find(x=>x.id===req.params.id); if(!a) return res.status(404).json({error:'Ad not found'})
  a.active = !a.active; db.set(()=>data); res.json({ ad: a })
})
