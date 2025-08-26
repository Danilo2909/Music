import { Router } from 'express'
import { db } from '../utils/db.js'
import { requireAuth } from '../middleware.js'

const router=Router()
router.use(requireAuth)

router.post('/:postId', (req,res)=>{
  const data=db.get(); const { postId }=req.params
  if(!data.saves.find(s=>s.userId===req.user.id && s.postId===postId)){
    data.saves.push({ userId:req.user.id, postId, createdAt:Date.now() })
    db.set(()=>data)
  }
  res.json({ ok:true })
})
router.delete('/:postId', (req,res)=>{
  const data=db.get(); const { postId }=req.params
  data.saves=data.saves.filter(s=>!(s.userId===req.user.id && s.postId===postId))
  db.set(()=>data); res.json({ ok:true })
})
router.get('/', (req,res)=>{
  const data=db.get()
  const my=(data.saves||[]).filter(s=>s.userId===req.user.id).map(s=>data.posts.find(p=>p.id===s.postId)).filter(Boolean)
  res.json({ posts: my })
})

export default router
