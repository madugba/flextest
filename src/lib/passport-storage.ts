import 'server-only'

import { mkdir, unlink, writeFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import type { ImageType } from './image-sniffing'

// ---------------------------------------------------------------------------
// Passport image persistence under public/passport.
// ---------------------------------------------------------------------------

export const PASSPORT_DIR = path.join(process.cwd(), 'public', 'passport')

// Only files matching our own naming scheme (passport_<ts>_<rand>.<ext>) are
// ever created or deleted.
const PASSPORT_NAME_PATTERN = /^passport_\d+_[a-z0-9]+\.(jpeg|png|webp|gif)$/i

function generatePassportName(imageType: ImageType, now: number): string {
  // Extension comes from the sniffed type, never from file.name.
  const randomString = Math.random().toString(36).substring(2, 15)
  return `passport_${now}_${randomString}.${imageType}`
}

export function isPassportImageName(filename: string): boolean {
  return PASSPORT_NAME_PATTERN.test(filename)
}

export async function savePassportImage(
  buffer: Buffer,
  imageType: ImageType,
  now = Date.now()
): Promise<string> {
  const filename = generatePassportName(imageType, now)
  await mkdir(PASSPORT_DIR, { recursive: true })
  await writeFile(path.join(PASSPORT_DIR, filename), buffer)
  return filename
}

export type DeletePassportResult = 'deleted' | 'missing' | 'invalid'

export async function deletePassportImage(url: string): Promise<DeletePassportResult> {
  // Strip to bare filename and resolve — guard against path traversal.
  const filename = path.basename(url)
  const filePath = path.join(PASSPORT_DIR, filename)

  // Ensure the resolved path is still inside PASSPORT_DIR.
  if (!filePath.startsWith(PASSPORT_DIR + path.sep) && filePath !== PASSPORT_DIR) {
    return 'invalid'
  }

  if (!isPassportImageName(filename)) return 'invalid'

  if (!existsSync(filePath)) return 'missing'

  await unlink(filePath)
  return 'deleted'
}
