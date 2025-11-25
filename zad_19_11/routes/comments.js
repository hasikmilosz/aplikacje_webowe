const express = require('express')

module.exports = function (prisma) {
  const router = express.Router()

  router.get('/posts/:postId/comments', async (req, res, next) => {
    try {
      const postId = Number(req.params.postId)
      if (isNaN(postId)) return res.status(400).json({ error: 'Invalid postId' })

      const comments = await prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'desc' }
      })
      res.json(comments)
    } catch (e) { next(e) }
  })

  router.get('/comments/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: { post: true }
      })
      if (!comment) return res.status(404).json({ error: 'Comment not found' })
      res.json(comment)
    } catch (e) { next(e) }
  })

  router.post('/posts/:postId/comments', async (req, res, next) => {
    try {
      const postId = Number(req.params.postId)
      if (isNaN(postId)) return res.status(400).json({ error: 'Invalid postId' })
      const body = req.body

      const postExists = await prisma.post.findUnique({ where: { id: postId } })
      if (!postExists) return res.status(404).json({ error: 'Post not found' })

      if (Array.isArray(body)) {
        if (body.length === 0) return res.status(400).json({ error: 'Empty array provided' })
        const invalidIndex = body.findIndex(it => !it || typeof it.createdBy !== 'string' || it.createdBy.trim() === '')
        if (invalidIndex !== -1) {
          return res.status(400).json({ error: 'Each item must have createdBy (string)', index: invalidIndex, received: body[invalidIndex] })
        }
        const creates = body.map(item => prisma.comment.create({
          data: { createdBy: item.createdBy, content: item.content ?? null, postId }
        }))
        const created = await prisma.$transaction(creates)
        return res.status(201).json(created)
      }

      const { createdBy, content } = body || {}
      if (!createdBy || typeof createdBy !== 'string') {
        return res.status(400).json({ error: 'Field "createdBy" (string) is required' })
      }
      const created = await prisma.comment.create({
        data: { createdBy, content: content ?? null, postId }
      })
      res.status(201).json(created)
    } catch (e) { next(e) }
  })

  router.post('/comments', async (req, res, next) => {
    try {
      const body = req.body

      if (Array.isArray(body)) {
        if (body.length === 0) return res.status(400).json({ error: 'Empty array provided' })

        const invalidIndex = body.findIndex(it => !it || typeof it.postId === 'undefined' || isNaN(Number(it.postId)) || typeof it.createdBy !== 'string' || it.createdBy.trim() === '')
        if (invalidIndex !== -1) {
          return res.status(400).json({ error: 'Each item must have postId (number) and createdBy (string)', index: invalidIndex, received: body[invalidIndex] })
        }

        const postIds = [...new Set(body.map(it => Number(it.postId)))]
        const existing = await prisma.post.findMany({ where: { id: { in: postIds } }, select: { id: true } })
        if (existing.length !== postIds.length) {
          const existingIds = existing.map(p => p.id)
          const missing = postIds.filter(id => !existingIds.includes(id))
          return res.status(400).json({ error: 'Some postIds do not exist', missing })
        }

        const creates = body.map(item => prisma.comment.create({
          data: { createdBy: item.createdBy, content: item.content ?? null, postId: Number(item.postId) }
        }))
        const created = await prisma.$transaction(creates)
        return res.status(201).json(created)
      }

      const { postId, createdBy, content } = body || {}
      if (postId === undefined || isNaN(Number(postId))) return res.status(400).json({ error: 'Field "postId" (number) is required' })
      if (!createdBy || typeof createdBy !== 'string') return res.status(400).json({ error: 'Field "createdBy" (string) is required' })

      const postExists = await prisma.post.findUnique({ where: { id: Number(postId) } })
      if (!postExists) return res.status(404).json({ error: 'Post not found' })

      const created = await prisma.comment.create({
        data: { createdBy, content: content ?? null, postId: Number(postId) }
      })
      res.status(201).json(created)
    } catch (e) { next(e) }
  })

  router.put('/comments/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      const { createdBy, content } = req.body || {}
      if (!createdBy || typeof createdBy !== 'string') {
        return res.status(400).json({ error: 'createdBy is required' })
      }
      const updated = await prisma.comment.update({
        where: { id },
        data: { createdBy, content: content ?? null }
      })
      res.json(updated)
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Comment not found' })
      next(e)
    }
  })

  router.delete('/comments/:id', async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })
      const deleted = await prisma.comment.delete({ where: { id } })
      res.json(deleted)
    } catch (e) {
      if (e.code === 'P2025') return res.status(404).json({ error: 'Comment not found' })
      next(e)
    }
  })

  return router
}