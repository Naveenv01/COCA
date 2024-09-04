// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs/promises'
import clientPromise from '@/lib/mongodb'

export const config = {
  api: {
    bodyParser: false,
  },
}

const parseTextFile = async (filePath: string): Promise<string[]> => {
  const data = await fs.readFile(filePath, 'utf-8')
  return data.split('\n').filter(line => line.trim() !== '')
}

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm({ uploadDir: './uploads', keepExtensions: true })

  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve([fields, files])
      })
    })

    const file = files.file as formidable.File
    const filePath = file.filepath

    const lines = await parseTextFile(filePath)
    const documents = lines.map(line => ({ text: line }))

    const client = await clientPromise
    const database = client.db('coca_like_db')
    const collection = database.collection('corpus')

    await collection.insertMany(documents)
    return NextResponse.json({ message: 'File processed and data stored in MongoDB' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to store data in MongoDB' }, { status: 500 })
  }
}
