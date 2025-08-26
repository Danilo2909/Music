import webpush from 'web-push'
const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT||'mailto:admin@musigram.local', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}
export async function sendPush(sub, payload){
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return
  try{ await webpush.sendNotification(sub, JSON.stringify(payload)) }catch(e){ /* ignore */ }
}
