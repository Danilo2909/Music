import { describe, it, expect } from 'vitest'
import { extractTags, extractMentions } from '../src/utils/text.js'
import { hasProfanity } from '../src/utils/profanity.js'

describe('text utils', () => {
  it('extracts tags', () => {
    const t = 'curtindo #MusiGram com #Amigos e #mUsIgRam'
    expect(extractTags(t)).toContain('musigram')
    expect(extractTags(t)).toContain('amigos')
  })
  it('extracts mentions', () => {
    const t = '@joao oi @maria'
    expect(extractMentions(t)).toContain('joao')
    expect(extractMentions(t)).toContain('maria')
  })
})

describe('profanity', () => {
  it('detects simple bad words', () => {
    expect(hasProfanity('isso é palavrao1')).toBe(true)
    expect(hasProfanity('texto limpo')).toBe(false)
  })
})
