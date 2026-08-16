import { NextRequest, NextResponse } from 'next/server'
import { sniffImageType } from '@/lib/image-sniffing'
import { deletePassportImage, savePassportImage } from '@/lib/passport-storage'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const maxUploadSizeBytes = 5 * 1024 * 1024
    if (file.size > maxUploadSizeBytes) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Validate by actual content, not the client-supplied MIME type or filename.
    const imageType = sniffImageType(buffer)
    if (!imageType) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, WebP and GIF images are allowed' },
        { status: 400 },
      )
    }

    const filename = await savePassportImage(buffer, imageType)

    return NextResponse.json({
      success: true,
      url: `/passport/${filename}`,
      filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json() as { url?: unknown }
    const { url } = body

    if (typeof url !== 'string' || !url) {
      return NextResponse.json({ error: 'No file URL provided' }, { status: 400 })
    }

    const result = await deletePassportImage(url)

    if (result === 'missing') {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    if (result === 'invalid') {
      return NextResponse.json({ error: 'Invalid file URL' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'File deleted successfully' })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
