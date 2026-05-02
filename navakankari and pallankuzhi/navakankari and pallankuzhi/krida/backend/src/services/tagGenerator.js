/**
 * tagGenerator.js (backend) — validates and sanitises tag IDs
 */
const TAG_RE = /^[A-Za-z]+-\d{4}$/

export const isValidTag = (tag) => TAG_RE.test(tag)
export const sanitiseTag = (tag) => tag.replace(/[^A-Za-z0-9-]/g, '').slice(0, 30)
