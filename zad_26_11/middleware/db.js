const { MongoClient, ServerApiVersion } = require('mongodb')

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

let database
async function connectDB(){
  if(!database){
    await client.connect()
    database = client.db('Logs')
    console.log('Connected to MongoDB')
  }
  return database
}

module.exports = connectDB