const express = require('express')

module.exports = function (prisma) {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try {
      const categories = await prisma.category.findMany({ include: { posts: true } })
      res.json(categories)
    } catch (e) { next(e) }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      const category = await prisma.category.findUnique({ where: { id }, include: { posts: true } })
      if (!category) return res.status(404).json({ error: 'Category not found' })
      res.json(category)
    } catch (e) { next(e) }
  })

  router.post('/', async (req, res, next) => {
    try {
      const body = req.body
      if (Array.isArray(body)) {
        if (body.length === 0) return res.status(400).json({ error: 'Empty array provided' })
        for (const [i, item] of body.entries()) {
          if (!item || typeof item.type !== 'string' || item.type.trim() === '') {
            return res.status(400).json({ error: 'Each item must have field "type" as non-empty string', index: i })
          }
        }
        const creates = body.map(item => prisma.category.create({ data: { type: item.type } }))
        const created = await prisma.$transaction(creates)
        return res.status(201).json(created)
      }
      const type = body && body.type
      if (!type || typeof type !== 'string' || type.trim() === '') {
        return res.status(400).json({ error: 'Field "type" (string) is required' })
      }
      const created = await prisma.category.create({ data: { type } })
      res.status(201).json(created)
    } catch (e) { next(e) }
  })

  router.put('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const { type } = req.body || {}
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      if (!type || typeof type !== 'string') return res.status(400).json({ error: 'Field "type" (string) is required' })
      const updated = await prisma.category.update({ where: { id }, data: { type } })
      res.json(updated)
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Category not found' })
      next(e)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      const deleted = await prisma.category.delete({ where: { id } })
      res.json(deleted)
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Category not found' })
      next(e)
    }
  })

  return router
}