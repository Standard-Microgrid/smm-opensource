/**
 * Cookie utility functions for managing active branch selection
 */

/**
 * Set the active branch ID in a cookie (client-side)
 */
export function setActiveBranchCookie(branchId: string) {
  // Set cookie that expires in 1 year, accessible across the site
  document.cookie = `activeBranchId=${branchId}; path=/; max-age=31536000; SameSite=Lax`
}

/**
 * Get the active branch ID from cookies (server-side)
 */
export async function getActiveBranchFromCookie(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    return cookieStore.get('activeBranchId')?.value || null
  } catch (error) {
    // If we're not in a server context, return null
    console.warn('Could not read cookies in server context:', error)
    return null
  }
}

/**
 * Clear the active branch cookie (client-side)
 */
export function clearActiveBranchCookie() {
  document.cookie = 'activeBranchId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
