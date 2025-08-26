import fs from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

function ensure(p){ if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}) }

const DRIVER = (process.env.STORAGE_DRIVER||'local').toLowerCase()

async function saveLocal({ buffer, ext, folder }){
  const id = Date.now() + '_' + Math.random().toString(36).slice(2)
  const base = path.join(process.cwd(), 'uploads', folder); ensure(base)
  const fpath = path.join(base, id + (ext||''))
  fs.writeFileSync(fpath, buffer)
  return `/uploads/${folder}/${path.basename(fpath)}`
}

async function saveS3({ buffer, ext, folder }){
  const id = Date.now() + '_' + Math.random().toString(36).slice(2) + (ext||'')
  const Key = `${folder}/${id}`
  const client = new S3Client({ region: process.env.S3_REGION, credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY } })
  await client.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key, Body: buffer, ContentType: ext?.endsWith('.png')?'image/png':undefined }))
  const base = process.env.S3_PUBLIC_BASE_URL || `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`
  return `${base}/${Key}`
}

export async function saveFile({ buffer, ext, folder }){
  if (DRIVER === 's3') return saveS3({ buffer, ext, folder })
  return saveLocal({ buffer, ext, folder })
}
