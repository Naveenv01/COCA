import { MongoClient } from 'mongodb'
import { SearchResult } from '../types'

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)

export async function searchCorpus(query: string): Promise<SearchResult[]> {
  try {
    await client.connect()
    const database = client.db('coca_like_db')
    const collection = database.collection('corpus')

    const results = await collection.aggregate([
      {
        $match: {
          $text: { $search: query }
        }
      },
      {
        $project: {
          _id: 1,
          text: 1,
          score: { $meta: 'textScore' }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray()

    return results.map(result => ({
      _id: result._id,
      text: result.text,
      score: result.score,
      highlightedText: highlightText(result.text, query)
    }))
  } finally {
    await client.close()
  }
}

function highlightText(text: string, query: string): string {
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
