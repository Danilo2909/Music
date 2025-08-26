const bad=['palavrao1','palavrao2','ofensa1','ofensa2'];
export function hasProfanity(t=''){ t = String(t||'').toLowerCase(); return bad.some(w=>t.includes(w)) }
