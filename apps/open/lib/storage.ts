import { createSupabaseClient } from "@smm/shared/supabase/client"

export interface UploadResult {
  success: boolean
  url?: string
  path?: string
  error?: string
}

export interface UploadOptions {
  bucket: string
  path: string
  file: File
  upsert?: boolean
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile({
  bucket,
  path,
  file,
  upsert = false
}: UploadOptions): Promise<UploadResult> {
  try {
    const supabase = createSupabaseClient()
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert,
        cacheControl: '3600',
        contentType: file.type
      })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(bucket: string, path: string): Promise<UploadResult> {
  try {
    const supabase = createSupabaseClient()
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Generate storage paths for minigrid files
 */
export function generateMinigridPaths(gridId: string, fileName: string, fileType: 'image' | 'document') {
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  if (fileType === 'image') {
    return {
      path: `grids/${gridId}/images/${timestamp}_${sanitizedFileName}`,
      bucket: 'grids'
    }
  } else {
    return {
      path: `grids/${gridId}/documents/${timestamp}_${sanitizedFileName}`,
      bucket: 'grids'
    }
  }
}

/**
 * Upload minigrid image
 */
export async function uploadMinigridImage(gridId: string, file: File): Promise<UploadResult> {
  const { path, bucket } = generateMinigridPaths(gridId, file.name, 'image')
  return uploadFile({ bucket, path, file, upsert: true })
}

/**
 * Upload minigrid document
 */
export async function uploadMinigridDocument(gridId: string, file: File): Promise<UploadResult> {
  const { path, bucket } = generateMinigridPaths(gridId, file.name, 'document')
  return uploadFile({ bucket, path, file, upsert: true })
}

/**
 * Delete minigrid file
 */
export async function deleteMinigridFile(path: string): Promise<UploadResult> {
  return deleteFile('grids', path)
}
