const fs = require('fs').promises
const path = require('path')

const TEMP_DIRS = [
  '/tmp/media-processing',
  '/tmp/file-conversions', 
  '/tmp/filter-processing'
]

const MAX_AGE_MINUTES = 5

async function cleanupOldFiles() {
  const cutoffTime = Date.now() - (MAX_AGE_MINUTES * 60 * 1000)
  
  for (const dir of TEMP_DIRS) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const dirPath = path.join(dir, entry.name)
          const stats = await fs.stat(dirPath)
          
          if (stats.mtime.getTime() < cutoffTime) {
            await fs.rm(dirPath, { recursive: true, force: true })
            console.log(`Cleaned up: ${dirPath}`)
          }
        }
      }
    } catch (error) {
      console.error(`Error cleaning ${dir}:`, error.message)
    }
  }
}

// Run cleanup every 2 minutes
setInterval(cleanupOldFiles, 2 * 60 * 1000)

// Run once on startup
cleanupOldFiles()

console.log('Cleanup service started - removing files older than 5 minutes every 2 minutes')