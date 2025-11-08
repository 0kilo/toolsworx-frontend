const fs = require('fs').promises
const path = require('path')

// Unified service uses /tmp/uploads for all conversions
const TEMP_DIRS = [
  '/tmp/uploads'
]

const MAX_AGE_MINUTES = 5

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir)
  } catch {
    try {
      await fs.mkdir(dir, { recursive: true })
      console.log(`Created directory: ${dir}`)
    } catch (error) {
      console.error(`Failed to create directory ${dir}:`, error.message)
    }
  }
}

async function cleanupOldFiles() {
  const cutoffTime = Date.now() - (MAX_AGE_MINUTES * 60 * 1000)

  for (const dir of TEMP_DIRS) {
    try {
      // Ensure directory exists before trying to clean it
      await ensureDirectoryExists(dir)

      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name)

        try {
          const stats = await fs.stat(entryPath)

          if (stats.mtime.getTime() < cutoffTime) {
            if (entry.isDirectory()) {
              await fs.rm(entryPath, { recursive: true, force: true })
            } else {
              await fs.unlink(entryPath)
            }
            console.log(`Cleaned up: ${entryPath}`)
          }
        } catch (statError) {
          // Skip files that may have been deleted by another process
          continue
        }
      }
    } catch (error) {
      // Only log if it's not a "directory doesn't exist" error
      if (error.code !== 'ENOENT') {
        console.error(`Error cleaning ${dir}:`, error.message)
      }
    }
  }
}

// Run cleanup every 2 minutes
setInterval(cleanupOldFiles, 2 * 60 * 1000)

// Run once on startup
cleanupOldFiles()

console.log('Cleanup service started - removing files older than 5 minutes every 2 minutes')