export const extractTags=t=>Array.from(new Set((t||'').match(/#([\w\d_]+)/g)||[])).map(x=>x.slice(1).toLowerCase())
export const extractMentions=t=>Array.from(new Set((t||'').match(/@([\w\d_]+)/g)||[])).map(x=>x.slice(1).toLowerCase())
