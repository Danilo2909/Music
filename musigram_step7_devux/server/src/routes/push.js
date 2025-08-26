import { Router } from 'express'
import { requireAuth } from '../middleware.js'
import { db } from '../utils/db.js'
import { sendPush } from '../utils/push.js'

const router=Router()
router.use(requireAuth)

router.post('/subscribe', (req,res)=>{
  const sub = req.body
  const data=db.get(); data.pushSubs=data.pushSubs||{}
  data.pushSubs[req.user.id]=sub; 
  db.set(()=>data)
  res.json({ ok:true })
})

router.post('/test', async (req,res)=>{
  const data=db.get(); const sub=(data.pushSubs||{})[req.user.id]
  if(!sub) return res.status(400).json({error:'sem inscrição'})
  await sendPush(sub,{ title:'MusiGram', body:'Teste de notificação' })
  res.json({ ok:true })
})

export default router
