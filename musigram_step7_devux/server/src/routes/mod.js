import { Router } from 'express'
import { db } from '../utils/db.js'
import { requireAuth } from '../middleware.js'
import { v4 as uuid } from 'uuid'

const router=Router()
router.use(requireAuth)

router.post('/report', (req,res)=>{
  const { type, targetId, reason } = req.body
  if(!type || !targetId) return res.status(400).json({error:'Missing'})
  const data=db.get()
  if(!data.reports) data.reports=[]
  const rep={ id:uuid(), reporterId:req.user.id, type, targetId, reason:reason||'', createdAt:Date.now(), status:'open' }
  data.reports.push(rep); db.set(()=>data)
  res.json({ ok:true, report: rep })
})

export default router
