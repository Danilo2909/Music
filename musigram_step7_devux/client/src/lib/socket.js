import { io } from 'socket.io-client'
export function connectSocket(userId){ const url=(import.meta.env.VITE_API_BASE||'http://localhost:4000/api').replace('/api',''); return io(url,{ auth:{ userId } }) }
