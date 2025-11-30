const connectDB = require('./db')

const logger = async (req, res, next) => {
  const start = Date.now()

  res.on('finish', async () => {
    const duration = Date.now() - start

    const log = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      responseTime: duration,
      timestamp: new Date(),
    };

    try {
      const database = await connectDB();
      await database.collection('accessLogs').insertOne(log)
    } catch (err) {
      console.error('Błąd zapisu loga do MongoDB:', err.message)
    }
  })

  next()
}

module.exports = logger