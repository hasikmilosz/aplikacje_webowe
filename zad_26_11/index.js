require("dotenv").config()

const logger = require('./middleware/logger')
const errorLogger = require('./middleware/errorLogger')
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const postsRouter = require('./routes/posts')
const categoriesRouter = require('./routes/categories')
const commentsRouter = require('./routes/comments')

const app = express()
const prisma = new PrismaClient()

app.use(express.json())
app.use(logger)
app.use('/posts', postsRouter(prisma))
app.use('/categories', categoriesRouter(prisma))
app.use('/', commentsRouter(prisma))
app.use(errorLogger)

app.listen(3000, () => {
    console.log('App is running on http://localhost:3000')
})

module.exports = prisma