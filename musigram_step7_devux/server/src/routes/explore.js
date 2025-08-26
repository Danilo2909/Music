import { Router } from 'express'
import { db } from '../utils/db.js'
const router = Router()
function paginate(arr, o=0, l=20){ const s=Math.max(0,parseInt(o)||0), e=s+Math.max(1,Math.min(100,parseInt(l)||20)); return arr.slice(s,e) }
router.get('/trending', (req,res)=>{
  const data=db.get()
  const scored = data.posts.map(p=>{
    const likes=data.likes.filter(l=>l.postId===p.id).length
    const comments=data.comments.filter(c=>c.postId===p.id).length
    const ageH=Math.max(1,(Date.now()-p.createdAt)/3600000)
    return { id:p.id, score:(likes*2+comments*3)/ageH }
  }).sort((a,b)=>b.score-a.score).map(s=>data.posts.find(p=>p.id===s.id))
  res.json({ posts: paginate(scored, req.query.offset, req.query.limit), total: scored.length })
})
router.get('/tag/:tag', (req,res)=>{
  const data=db.get(); const tag=req.params.tag.toLowerCase()
  const ids=data.hashtags_index?.[tag]||[]; const posts=ids.map(id=>data.posts.find(p=>p.id===id)).filter(Boolean)
  res.json({ posts: paginate(posts, req.query.offset, req.query.limit), total: posts.length })
})
export default router
