import { Router } from 'express'
import { db } from '../utils/db.js'
import { hasProfanity } from '../utils/profanity.js'
import { requireAuth } from '../middleware.js'
import multer from 'multer'
import path from 'path'
import { v4 as uuid } from 'uuid'
import { saveFile } from '../utils/storage.js'
import { extractTags } from '../utils/text.js'
const router = Router(); const upload=multer({ storage: multer.memoryStorage() })
function paginate(arr, o=0, l=20){ const s=Math.max(0,parseInt(o)||0), e=s+Math.max(1,Math.min(100,parseInt(l)||20)); return arr.slice(s,e) }

router.get('/', (req,res)=>{
  const data=db.get(); const o=req.query.offset||0, l=req.query.limit||20
  const list = [...data.posts].filter(p=>{ const u=data.users.find(x=>x.id===p.userId); return !u?.shadowbanned }).sort((a,b)=>b.createdAt-a.createdAt).map(p=>({
    ...p,
    likeCount: data.likes.filter(l=>l.postId===p.id).length,
    commentCount: data.comments.filter(c=>c.postId===p.id).length
  }))
  res.json({ posts: paginate(list,o,l), total: list.length })
})

router.get('/feed', requireAuth, (req,res)=>{
  const data=db.get(); const o=req.query.offset||0, l=req.query.limit||20
  const following = data.follows.filter(f=>f.followerId===req.user.id).map(f=>f.followingId)
  const set = new Set([req.user.id, ...following])
  const list = data.posts.filter(p=>set.has(p.userId)).sort((a,b)=>b.createdAt-a.createdAt).map(p=>({
    ...p,
    likeCount: data.likes.filter(l=>l.postId===p.id).length,
    commentCount: data.comments.filter(c=>c.postId===p.id).length
  }))
  res.json({ posts: paginate(list,o,l), total: list.length })
})

router.get('/:id', (req,res)=>{
  const data=db.get(); const p=data.posts.find(x=>x.id===req.params.id)
  if(!p) return res.status(404).json({error:'Not found'})
  res.json({ post: p })
})

router.post('/', requireAuth, upload.fields([{name:'audio',maxCount:1},{name:'cover',maxCount:1}]), async (req,res)=>{
  const data=db.get(); const { caption } = req.body
  const audio=req.files?.audio?.[0]; if(!audio) return res.status(400).json({error:'Audio required'})
  const audioUrl = await saveFile({ buffer:audio.buffer, ext: path.extname(audio.originalname)||'.mp3', folder:'audio' })
  let coverUrl=''; const cover=req.files?.cover?.[0]; if(cover) coverUrl = await saveFile({ buffer:cover.buffer, ext:path.extname(cover.originalname)||'.png', folder:'images' })
  if(hasProfanity(caption||'')) return res.status(400).json({error:'Conteúdo bloqueado (palavrões)'});
  const id = uuid(); const post={ id, userId:req.user.id, caption:caption||'', audioUrl, coverUrl, createdAt:Date.now() }
  data.posts.push(post)
  const tags=extractTags(post.caption); data.hashtags_index=data.hashtags_index||{}; for(const t of tags){ if(!data.hashtags_index[t]) data.hashtags_index[t]=[]; data.hashtags_index[t].unshift(post.id) }
  db.set(()=>data); res.json({ post })
})

router.delete('/:id', requireAuth, (req,res)=>{
  const data=db.get(); const p=data.posts.find(x=>x.id===req.params.id)
  if(!p) return res.status(404).json({error:'Not found'})
  if(p.userId!==req.user.id) return res.status(403).json({error:'Not your post'})
  data.posts = data.posts.filter(x=>x.id!==p.id); data.comments=data.comments.filter(c=>c.postId!==p.id); data.likes=data.likes.filter(l=>l.postId!==p.id)
  db.set(()=>data); res.json({ ok:true })
})

router.post('/:id/like', requireAuth, (req,res)=>{
  const data=db.get(); const postId=req.params.id
  if(data.likes.find(l=>l.postId===postId&&l.userId===req.user.id)) return res.status(400).json({error:'Already liked'})
  data.likes.push({ id: uuid(), postId, userId:req.user.id, createdAt:Date.now() }); db.set(()=>data); res.json({ ok:true })
})
router.delete('/:id/like', requireAuth, (req,res)=>{
  const data=db.get(); const postId=req.params.id
  data.likes = data.likes.filter(l=>!(l.postId===postId&&l.userId===req.user.id)); db.set(()=>data); res.json({ ok:true })
})

router.get('/:id/comments', (req,res)=>{
  const data=db.get(); const o=req.query.offset||0, l=req.query.limit||20
  const comments = data.comments.filter(c=>c.postId===req.params.id).sort((a,b)=>a.createdAt-b.createdAt)
  res.json({ comments: paginate(comments,o,l), total: comments.length })
})
router.post('/:id/comments', requireAuth, (req,res)=>{
  const data=db.get(); const p=data.posts.find(x=>x.id===req.params.id); if(!p) return res.status(404).json({error:'Post not found'})
  const { text }=req.body; if(!text) return res.status(400).json({error:'Text required'})
  const c={ id: uuid(), postId:p.id, userId:req.user.id, text, createdAt:Date.now() }
  data.comments.push(c); db.set(()=>data); res.json({ comment: c })
})

export default router
