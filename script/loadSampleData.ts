import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGODB_URI as string

const client = new MongoClient(uri)

const sampleData = [
  { text: "The quick brown fox jumps over the lazy dog." },
  { text: "To be or not to be, that is the question." },
  { text: "All that glitters is not gold." },
  { text: "A picture is worth a thousand words." },
  { text: "Actions speak louder than words." }
]

async function loadSampleData() {
  try {
    await client.connect()
    const database = client.db('coca_like_db')
    const collection = database.collection('corpus')

    // Create a text index for efficient searching
    await collection.createIndex({ text: 'text' })

    // Insert sample data
    const result = await collection.insertMany(sampleData)
    console.log(`${result.insertedCount} documents were inserted`)
  } finally {
    await client.close()
  }
}

loadSampleData().catch(console.error)