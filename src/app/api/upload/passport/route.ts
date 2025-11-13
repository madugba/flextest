import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    const maxUploadSizeBytes = 5 * 1024 * 1024
    if (file.size > maxUploadSizeBytes) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(file.name)
    const filename = `passport_${timestamp}_${randomString}${extension}`

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const publicPath = path.join(process.cwd(), 'public', 'passport')
    const filePath = path.join(publicPath, filename)

    await mkdir(publicPath, { recursive: true })

    await writeFile(filePath, buffer)

    const fileUrl = `/passport/${filename}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      filename,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url) {
      return NextResponse.json(
        { error: 'No file URL provided' },
        { status: 400 }
      )
    }

    
    const filename = url.split('/').pop()

    if (!filename) {
      return NextResponse.json(
        { error: 'Invalid file URL' },
        { status: 400 }
      )
    }

    const publicPath = path.join(process.cwd(), 'public', 'passport')
    const filePath = path.join(publicPath, filename)

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    await unlink(filePath)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}
