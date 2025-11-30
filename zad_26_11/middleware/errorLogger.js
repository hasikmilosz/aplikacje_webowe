const connectDB = require('./db')

const errorLogger = async (err, req, res, next) => {
  const errorLog = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date(),
  }

  try {
    const database = await connectDB()
    await database.collection('errorLogs').insertOne(errorLog)
  } catch (saveErr) {
    console.error('Błąd zapisu błędu do MongoDB:', saveErr.message)
  }

  res.status(err.status || 500).json({
    error: 'Wystąpił błąd serwera',
    message: err.message,
  })
}

module.exports = errorLogger