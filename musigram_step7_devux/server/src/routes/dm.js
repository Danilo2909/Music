import { Router } from 'express'
import { db } from '../utils/db.js'
import { requireAuth } from '../middleware.js'
import { v4 as uuid } from 'uuid'
import { notify } from '../utils/notify.js'

const router = Router()
router.use(requireAuth)

router.get('/conversations', (req,res)=>{
  const data=db.get()
  const mine=(data.conversations||[]).filter(c=>c.participants.includes(req.user.id)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0))
  res.json({ conversations: mine })
})

router.post('/start', (req,res)=>{
  const { userId } = req.body
  if(!userId || userId===req.user.id) return res.status(400).json({error:'userId inválido'})
  const data=db.get()
  let c=(data.conversations||[]).find(c=>c.participants.includes(req.user.id) && c.participants.includes(userId))
  if(!c){ c={ id:uuid(), participants:[req.user.id, userId], createdAt:Date.now(), updatedAt:Date.now() }; data.conversations.push(c); db.set(()=>data) }
  res.json({ conversation: c })
})

router.post('/send', (req,res)=>{
  const { conversationId, text } = req.body
  if(!text) return res.status(400).json({error:'texto obrigatório'})
  const data=db.get()
  const c=(data.conversations||[]).find(x=>x.id===conversationId && x.participants.includes(req.user.id))
  if(!c) return res.status(404).json({error:'conversa não encontrada'})
  const m={ id:uuid(), conversationId, senderId:req.user.id, text, createdAt:Date.now(), readBy:[req.user.id] }
  data.messages.push(m); c.updatedAt=Date.now()
  const other=c.participants.find(p=>p!==req.user.id)
  const io=req.app.get('io')
  const notif={ id:uuid(), userId:other, type:'dm', actorId:req.user.id, conversationId, createdAt:Date.now(), read:false }
  data.notifications.push(notif)
  notify(io, other, notif)
  db.set(()=>data)
  res.json({ message: m })
})

router.get('/messages/:conversationId', (req,res)=>{
  const data=db.get()
  const c=(data.conversations||[]).find(x=>x.id===req.params.conversationId && x.participants.includes(req.user.id))
  if(!c) return res.status(404).json({error:'conversa não encontrada'})
  const list=(data.messages||[]).filter(m=>m.conversationId===c.id).sort((a,b)=>a.createdAt-b.createdAt)
  res.json({ messages: list })
})

export default router
