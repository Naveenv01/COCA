import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { SearchResult } from '@/types'
import clientPromise from '@/lib/mongodb'


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const client=await clientPromise;
    const database = client.db('coca_like_db')
    const collection = database.collection('corpus')

    console.log(q)

    const results = await collection.aggregate([
      {
        $match: {
          $text: { $search: q }
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
console.log(results)
    const result:SearchResult[]= results.map(result => ({
      _id: result._id,
      text: result.text,
      score: result.score,
      highlightedText: highlightText(result.text, q)
    }))
    return NextResponse.json(result)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 })
  }

  function highlightText(text: string, query: string): string {
    const regex = new RegExp(`(${query})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  }
}