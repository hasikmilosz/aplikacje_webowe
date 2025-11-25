const express = require('express')

module.exports = function (prisma) {
  const router = express.Router()

  router.get('/', async (req, res, next) => {
    try {
      const { published, categoryId, search } = req.query
      const filters = {}
      if (published !== undefined) {
        if (published !== 'true' && published !== 'false') {
          return res.status(400).json({ error: 'published must be true|false' })
        }
        filters.published = published === 'true'
      }
      if (categoryId !== undefined) {
        const cid = Number(categoryId)
        if (isNaN(cid)) return res.status(400).json({ error: 'categoryId must be number' })
        filters.categoryId = cid
      }

      const posts = await prisma.post.findMany({
        where: {
          ...filters,
          OR: search ? [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } }
          ] : undefined
        },
        include: { category: true, comments: true },
        orderBy: { createdAt: 'desc' }
      })
      res.json(posts)
    } catch (e) { next(e) }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

      const post = await prisma.post.findUnique({
        where: { id },
        include: { category: true, comments: true }
      })
      if (!post) return res.status(404).json({ error: 'Post not found' })
      res.json(post)
    } catch (e) { next(e) }
  })

  router.post('/', async (req, res, next) => {
    try {
      const body = req.body

      if (Array.isArray(body)) {
        if (body.length === 0) return res.status(400).json({ error: 'Empty array provided' })

        const invalidIndex = body.findIndex(
          it => !it || typeof it.title !== 'string' || it.title.trim() === '' ||
            typeof it.author !== 'string' || it.author.trim() === '' ||
            it.categoryId === undefined || isNaN(Number(it.categoryId))
        )
        if (invalidIndex !== -1) {
          return res.status(400).json({ error: 'Each item must have title (string), author (string), categoryId (number)', index: invalidIndex, received: body[invalidIndex] })
        }

        const categoryIds = [...new Set(body.map(it => Number(it.categoryId)))]
        const existingCats = await prisma.category.findMany({ where: { id: { in: categoryIds } }, select: { id: true } })
        if (existingCats.length !== categoryIds.length) {
          const existingIds = existingCats.map(c => c.id)
          const missing = categoryIds.filter(id => !existingIds.includes(id))
          return res.status(400).json({ error: 'Some categoryIds do not exist', missing })
        }

        const creates = body.map(item => prisma.post.create({
          data: {
            title: item.title,
            content: item.content ?? null,
            author: item.author,
            categoryId: Number(item.categoryId),
            published: !!item.published
          }
        }))
        const created = await prisma.$transaction(creates)
        return res.status(201).json(created)
      }

      const { title, content, author, categoryId, published } = body || {}
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Field "title" (string) is required' })
      }
      if (!author || typeof author !== 'string') {
        return res.status(400).json({ error: 'Field "author" (string) is required' })
      }
      if (categoryId === undefined || isNaN(Number(categoryId))) {
        return res.status(400).json({ error: 'Field "categoryId" (number) is required' })
      }

      const cat = await prisma.category.findUnique({ where: { id: Number(categoryId) } })
      if (!cat) return res.status(404).json({ error: 'Category not found' })

      const created = await prisma.post.create({
        data: {
          title,
          content: content ?? null,
          author,
          categoryId: Number(categoryId),
          published: !!published
        }
      })
      res.status(201).json(created)
    } catch (e) { next(e) }
  })

  router.put('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      const { title, content, author, categoryId, published } = req.body || {}
      if (!title || !author || categoryId === undefined) {
        return res.status(400).json({ error: 'title, author, categoryId are required' })
      }
      const updated = await prisma.post.update({
        where: { id },
        data: {
          title,
          content: content ?? null,
          author,
          categoryId: Number(categoryId),
          published: !!published
        }
      })
      res.json(updated)
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Post not found' })
      next(e)
    }
  })

  router.delete('/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

      const result = await prisma.$transaction([
        prisma.comment.deleteMany({ where: { postId: id } }),
        prisma.post.delete({ where: { id } })
      ])

      res.json(result[1])

    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Post not found' })
      next(e)
    }
  })

  return router
}