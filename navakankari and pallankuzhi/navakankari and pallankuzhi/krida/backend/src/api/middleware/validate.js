/**
 * validate.js — Zod schema validation middleware factory
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    return res.status(422).json({ error: 'Validation failed', issues: result.error.issues })
  }
  req.body = result.data
  next()
}
