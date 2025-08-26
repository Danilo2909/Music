export function notify(io, userId, payload){ if(io && userId){ io.to('user:'+userId).emit('notification', payload) } }
