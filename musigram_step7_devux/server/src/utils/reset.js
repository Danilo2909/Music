import { db } from './db.js'
const empty={"users": [], "posts": [], "comments": [], "follows": [], "likes": [], "hashtags_index": {}, "conversations": [], "messages": [], "notifications": [], "blocks": [], "stories": [], "saves": [], "playlists": [], "reports": [], "ads": [], "purchases": [], "subscriptions": []}
db.set(()=>empty)
console.log('DB reset')
