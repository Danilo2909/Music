import { Router } from 'express'
import { db } from '../utils/db.js'
import { requireAuth } from '../middleware.js'
import { v4 as uuid } from 'uuid'

const router=Router()
router.use(requireAuth)

router.post('/', (req,res)=>{
  const { name }=req.body
  const data=db.get(); const pl={ id:uuid(), userId:req.user.id, name, posts:[], createdAt:Date.now() }
  data.playlists.push(pl); db.set(()=>data); res.json({ playlist:pl })
})
router.post('/:id/add/:postId', (req,res)=>{
  const data=db.get(); const pl=data.playlists.find(p=>p.id===req.params.id && p.userId===req.user.id)
  if(!pl) return res.status(404).json({error:'Playlist not found'})
  if(!pl.posts.includes(req.params.postId)) pl.posts.push(req.params.postId)
  db.set(()=>data); res.json({ playlist:pl })
})
router.delete('/:id/remove/:postId', (req,res)=>{
  const data=db.get(); const pl=data.playlists.find(p=>p.id===req.params.id && p.userId===req.user.id)
  if(!pl) return res.status(404).json({error:'Playlist not found'})
  pl.posts=pl.posts.filter(pid=>pid!==req.params.postId)
  db.set(()=>data); res.json({ playlist:pl })
})
router.get('/', (req,res)=>{
  const data=db.get(); const pls=(data.playlists||[]).filter(p=>p.userId===req.user.id)
  res.json({ playlists:pls })
})

export default router
