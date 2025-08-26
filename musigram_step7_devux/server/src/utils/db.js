import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB = path.join(__dirname, '..', 'data', 'db.json')
function read(){ try{ return JSON.parse(fs.readFileSync(DB,'utf-8')) }catch{ return {} } }
function write(d){ fs.writeFileSync(DB, JSON.stringify(d,null,2)) }
export const db = { get:()=>read(), set:(fn)=>{ const cur=read(); const up=fn(cur); write(up); return up } }
