import { Router } from 'express'
import { db } from '../utils/db.js'
import { requireAuth } from '../middleware.js'
import { v4 as uuid } from 'uuid'

const router = Router()
router.use(requireAuth)

router.post('/', (req,res)=>{
  const { imageUrl, caption } = req.body
  const data=db.get()
  const s={ id:uuid(), userId:req.user.id, imageUrl, caption:caption||'', createdAt:Date.now() }
  data.stories.push(s); db.set(()=>data)
  res.json({ story:s })
})

router.get('/feed', (req,res)=>{
  const data=db.get()
  const cutoff=Date.now()-24*3600*1000
  const active=(data.stories||[]).filter(s=>s.createdAt>=cutoff)
  res.json({ stories: active })
})

export default router
