import { Router } from 'express'
import Stripe from 'stripe'
import { requireAuth } from '../middleware.js'
import { db } from '../utils/db.js'

const router = Router()
const stripeKey = process.env.STRIPE_SECRET_KEY||''
const stripe = stripeKey ? new Stripe(stripeKey) : null

function assertStripe(res){
  if(!stripe) { res.status(400).json({ error: 'Stripe não configurado' }); return false }
  return true
}

router.use(requireAuth)

router.post('/create-checkout-session', async (req,res)=>{
  if(!assertStripe(res)) return
  const { amount } = req.body // em centavos
  const cents = Math.max(100, parseInt(amount||0)) // mínimo R$1,00
  const url = process.env.APP_PUBLIC_URL || 'http://localhost:5173'
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price_data: { currency: 'brl', product_data: { name: 'Gorjeta MusiGram' }, unit_amount: cents }, quantity: 1 }],
    success_url: url + '/?tip=success',
    cancel_url: url + '/?tip=cancel',
    metadata: { userId: req.user.id, type: 'tip' }
  })
  res.json({ url: session.url })
})

router.post('/create-subscription-session', async (req,res)=>{
  if(!assertStripe(res)) return
  const { plan } = req.body // 'monthly' | 'yearly'
  const price = plan==='yearly' ? process.env.STRIPE_PRICE_YEARLY : process.env.STRIPE_PRICE_MONTHLY
  if(!price) return res.status(400).json({ error: 'PRICE não configurado' })
  const url = process.env.APP_PUBLIC_URL || 'http://localhost:5173'
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price }],
    success_url: url + '/?sub=success',
    cancel_url: url + '/?sub=cancel',
    metadata: { userId: req.user.id, type: 'sub' }
  })
  res.json({ url: session.url })
})

export async function webhook(req,res){
  const sk = process.env.STRIPE_SECRET_KEY||''
  const wh = process.env.STRIPE_WEBHOOK_SECRET||''
  const stripe = sk ? new Stripe(sk) : null
  if(!stripe || !wh) return res.status(400).json({ error: 'Stripe não configurado' })
  const sig = req.headers['stripe-signature']
  let event
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, wh)
  }catch(err){
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  const data = db.get()
  if(event.type==='checkout.session.completed'){
    const s = event.data.object
    const userId = s.metadata?.userId
    const user = data.users.find(u=>u.id===userId)
    if(userId && user){
      if(s.mode==='subscription'){
        user.isPro = true
        data.subscriptions.push({ userId, sessionId: s.id, createdAt: Date.now(), status: 'active' })
      }else if(s.mode==='payment'){
        data.purchases.push({ userId, sessionId: s.id, amount_total: s.amount_total, createdAt: Date.now() })
      }
      db.set(()=>data)
    }
  }
  res.json({ received: true })
}

export default router
