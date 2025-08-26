import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import rateLimit from 'express-rate-limit'
import http from 'http'
import { Server as IOServer } from 'socket.io'
import client from 'prom-client'
import { logger } from './utils/logger.js'
import { fileURLToPath } from 'url'

import auth from './routes/auth.js'
import users from './routes/users.js'
import posts from './routes/posts.js'
import explore from './routes/explore.js'
import dm from './routes/dm.js'
import mod from './routes/mod.js'
import admin from './routes/admin.js'
import payments, { webhook as stripeWebhook } from './routes/payments.js'
import ads from './routes/ads.js'
import push from './routes/push.js'
import stories from './routes/stories.js'
import saves from './routes/saves.js'
import playlists from './routes/playlists.js'

dotenv.config()
client.collectDefaultMetrics()
const app = express()
const server = http.createServer(app)
const io = new IOServer(server, { cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true } })
app.set('io', io)
io.on('connection', s => { const uid = s.handshake?.auth?.userId; if(uid) s.join('user:'+uid) })
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN||'http://localhost:5173', credentials: true }))
app.use(morgan('dev'))
const limit = rateLimit({ windowMs:60*1000, limit:300 })
app.use(limit)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), stripeWebhook)
app.use(express.json({ limit:'10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/', (req,res)=>res.json({ ok:true, name:'MusiGram API (Step 1)' }))
app.get('/metrics', async (req,res)=>{ res.set('Content-Type', client.register.contentType); res.end(await client.register.metrics()) })

app.use('/api/auth', auth)
app.use('/api/users', users)
app.use('/api/posts', posts)
app.use('/api/explore', explore)

app.use('/api/dm', dm)
app.use('/api/mod', mod)
app.use('/api/admin', admin)
app.use('/api/payments', payments)
app.use('/api/ads', ads)
app.use('/api/push', push)

app.use('/api/stories', stories)
app.use('/api/saves', saves)
app.use('/api/playlists', playlists)

const PORT = process.env.PORT||4000
server.listen(PORT, ()=>{ logger.info({ msg:'API start', port:PORT }); console.log('API http://localhost:'+PORT) })
