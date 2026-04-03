import { getCloudflareContext } from '@opennextjs/cloudflare'
import { getR2 } from '@/lib/d1'
import { NextResponse } from 'next/server'



export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 1. Size Validation (5MB max)
    const MAX_SIZE = 5 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
    }

    // 2. MIME Type Validation (Images only)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    const bucket = await getR2()
    const buffer = await file.arrayBuffer()
    
    // Clean filename and add timestamp
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${Date.now()}-${cleanName}`
    
    await bucket.put(filename, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000, immutable',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      }
    })

    // Return the URL to our asset handler
    const url = `/api/assets/${filename}`
    
    return NextResponse.json({ url })
  } catch (error) {
    console.error('R2 upload error:', error)
    return NextResponse.json({ error: 'Upload failed: ' + (error.message || 'Internal error') }, { status: 500 })
  }
}
