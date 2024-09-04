import { NextRequest, NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs/promises'
import clientPromise from '@/lib/mongodb'
import { revalidatePath } from 'next/cache'


export const config = {
  api: {
    bodyParser: false,
  },
}

const parseTextFile = async (filePath: string): Promise<string[]> => {
  const data = await fs.readFile(filePath, 'utf-8')
  return data.split('\n').filter(line => line.trim() !== '')
}

export async function uploadFile(req: NextRequest){

  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    await fs.writeFile(`./public/uploads/${file.name}`, buffer);

    revalidatePath("/");

    

    return NextResponse.json({ message: 'File processed and data stored in MongoDB' })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to store data in MongoDB' }, { status: 500 })
  }

  
  
}

// Helper function to convert NextRequest body to a stream
const parseForm = async (req: NextRequest): Promise<{ fields: formidable.Fields, files: formidable.Files }> => {
  const form = new formidable.IncomingForm({ uploadDir: './uploads', keepExtensions: true })

  // Convert NextRequest to a readable stream for formidable
  const buffers: Buffer[] = []
  for await (const chunk of req.body as unknown as ReadableStream<Uint8Array>) {
    buffers.push(Buffer.from(chunk))
  }

  const stream = Readable.from(Buffer.concat(buffers))

  return new Promise((resolve, reject) => {
    form.parse(stream, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}