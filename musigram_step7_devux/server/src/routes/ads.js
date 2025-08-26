import { Router } from 'express'
import { db } from '../utils/db.js'

const router = Router()

router.get('/feed', (req,res)=>{
  const data=db.get()
  const active=(data.ads||[]).filter(a=>a.active!==false && (a.remaining===undefined || a.remaining>0))
  res.json({ ads: active })
})

export default router
