import { getR2 } from '@/lib/d1'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bucket = await getR2()
    const buffer = await file.arrayBuffer()
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    await bucket.put(filename, buffer, {
      httpMetadata: {
        contentType: file.type
      }
    })

    // Return the URL to our own asset handler (which we will create next)
    // The asset handler will fetch from R2
    const url = `/api/assets/${filename}`
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('R2 upload error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
