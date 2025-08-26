import { Router } from 'express'
import { db } from '../utils/db.js'
import { notify } from '../utils/notify.js'
import { requireAuth } from '../middleware.js'
const router = Router()

router.get('/:username', (req,res)=>{
  const data=db.get()
  const u=data.users.find(x=>x.username.toLowerCase()===req.params.username.toLowerCase())
  if(!u) return res.status(404).json({error:'Not found'})
  const followers = data.follows.filter(f=>f.followingId===u.id).length
  const following = data.follows.filter(f=>f.followerId===u.id).length
  res.json({ user: { id:u.id, name:u.name, username:u.username, bio:u.bio, avatarUrl:u.avatarUrl }, stats:{ followers, following, posts: data.posts.filter(p=>p.userId===u.id).length } })
})

router.put('/me', requireAuth, (req,res)=>{
  const data=db.get()
  const i=data.users.findIndex(u=>u.id===req.user.id)
  if(i===-1) return res.status(404).json({error:'User not found'})
  const { name, bio, avatarUrl } = req.body
  if(name!==undefined) data.users[i].name=name
  if(bio!==undefined) data.users[i].bio=bio
  if(avatarUrl!==undefined) data.users[i].avatarUrl=avatarUrl
  db.set(()=>data)
  const u=data.users[i]
  res.json({ user:{ id:u.id, name:u.name, username:u.username, bio:u.bio, avatarUrl:u.avatarUrl } })
})

router.post('/:id/follow', requireAuth, (req,res)=>{
  const data=db.get(); const { id }=req.params
  if(id===req.user.id) return res.status(400).json({error:'Self-follow'})
  if(data.follows.find(f=>f.followerId===req.user.id&&f.followingId===id)) return res.status(400).json({error:'Already following'})
  data.follows.push({ followerId:req.user.id, followingId:id, createdAt:Date.now() })
  const io=req.app.get('io');
  const notif={ id: (Date.now()+''), userId:id, type:'follow', actorId:req.user.id, createdAt:Date.now(), read:false }
  data.notifications.push(notif)
  notify(io, id, notif)
  db.set(()=>data); res.json({ ok:true })
})

router.delete('/:id/follow', requireAuth, (req,res)=>{
  const data=db.get(); const { id }=req.params
  data.follows = data.follows.filter(f=>!(f.followerId===req.user.id&&f.followingId===id))
  db.set(()=>data); res.json({ ok:true })
})

export default router
