import { getR2 } from '@/lib/d1'
import { NextResponse } from 'next/server'



export async function GET(request, { params }) {
  try {
    const { filename } = await params
    const bucket = await getR2()
    
    // Attempt to retrieve the file
    const object = await bucket.get(filename)

    if (!object) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Prepare response with appropriate headers
    const headers = new Headers()
    headers.set('ETag', object.httpEtag)
    
    object.writeHttpMetadata(headers)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    
    // We send back a ReadableStream via the response body
    return new Response(object.body, { headers })
  } catch (error) {
    console.error('R2 retrieve error:', error)
    return NextResponse.json({ error: error.message || 'Error occurred while loading file' }, { status: 500 })
  }
}
