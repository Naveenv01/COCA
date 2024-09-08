import { NextRequest, NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import clientPromise from '@/lib/mongodb'



export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const fileContent = await file.text()
  const sentences = fileContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0)
  console.log(sentences)

  try {
    const client=await clientPromise;
    const database = client.db('coca_like_db')
    const collection = database.collection('corpus')

    const result = await collection.insertMany(
      sentences.map(sentence => ({ text: sentence.trim() }))
    )

    return NextResponse.json({ message: `${result.insertedCount} sentences added to the database` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to process the file' }, { status: 500 })
  } finally {
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}