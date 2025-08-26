import { db } from './db.js'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'

function user(name, username, email, { admin=false }={}){
  return { id: uuid(), name, username, email, bio:'', avatarUrl:'', createdAt: Date.now(), isAdmin:admin, isBanned:false, shadowbanned:false, emailVerified:true, passwordHash:'' }
}

async function run(){
  const data = db.get()
  data.users = []
  data.posts = []
  data.comments = []
  data.likes = []
  data.follows = []
  data.hashtags_index = {}
  data.stories = []
  data.saves = []
  data.playlists = []
  data.conversations = []
  data.messages = []
  data.notifications = []
  data.reports = []
  data.ads = []
  data.pushSubs = {}
  data.purchases = []
  data.subscriptions = []

  // users
  const admin = user('Admin','admin','admin@mg.local', {admin:true})
  const a = user('Ana','ana','ana@mg.local')
  const b = user('Bruno','bruno','bruno@mg.local')
  const c = user('Carla','carla','carla@mg.local')
  const pwd = await bcrypt.hash('123456', 10)
  for(const u of [admin,a,b,c]) u.passwordHash = pwd
  data.users.push(admin,a,b,c)

  // follows
  data.follows.push({ followerId:a.id, followingId:b.id, createdAt:Date.now() })
  data.follows.push({ followerId:b.id, followingId:a.id, createdAt:Date.now() })
  data.follows.push({ followerId:c.id, followingId:a.id, createdAt:Date.now() })

  function addPost(u, caption, audioUrl='', coverUrl=''){
    const id = uuid()
    const p = { id, userId:u.id, caption, audioUrl: audioUrl || '/uploads/audio/demo.mp3', coverUrl: coverUrl || '', createdAt: Date.now() - Math.floor(Math.random()*1e7) }
    data.posts.push(p)
    const tags = (caption.match(/#([\w\d_]+)/g)||[]).map(s=>s.slice(1).toLowerCase())
    for(const t of tags){ if(!data.hashtags_index[t]) data.hashtags_index[t]=[]; data.hashtags_index[t].unshift(p.id) }
    return p
  }

  const p1 = addPost(a, 'Nova track #beat #trap')
  const p2 = addPost(b, 'Som do dia #pop')
  const p3 = addPost(a, 'Demo ao vivo #acustico')
  const p4 = addPost(c, 'Check this out #bass #house')

  // likes/comments
  data.likes.push({ id:uuid(), postId:p1.id, userId:b.id, createdAt:Date.now() })
  data.comments.push({ id:uuid(), postId:p1.id, userId:b.id, text:'massa!', createdAt:Date.now() })

  // stories
  data.stories.push({ id:uuid(), userId:a.id, imageUrl:'https://via.placeholder.com/300', caption:'making of', createdAt: Date.now() })

  // playlists
  data.playlists.push({ id:uuid(), userId:a.id, name:'Best of Ana', posts:[p1.id,p3.id], createdAt:Date.now() })

  // ads
  data.ads.push({ id:String(Date.now()), imageUrl:'https://via.placeholder.com/640x200', link:'https://musigram.local', budget:1000, remaining:1000, active:true, createdAt:Date.now() })

  db.set(()=>data)
  console.log('Seed concluído. Login padrão: qualquer usuário com senha 123456')
}

run()
