const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("storyvault");
  console.log("Connected to MongoDB");
}

function getDB() {
  return db;
}

module.exports = {
  connectDB,
  getDB
};