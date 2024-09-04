import { NextRequest, NextResponse } from 'next/server'
import { searchCorpus } from '../../../lib/search'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const results = await searchCorpus(q)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'An error occurred while searching' }, { status: 500 })
  }
}