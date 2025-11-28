# Lambda Sharp Module Fix

**Issue:** Sharp module fails to load in Lambda with error:
```
Could not load the "sharp" module using the linux-x64 runtime
```

**Status:** ✅ FIXED - Requires Amplify Redeploy

---

## What Was Fixed

### 1. Created `package.json` for Each Lambda Function

Lambda functions now have their own package.json with platform-specific dependencies:

**Media Conversion Lambda** (`amplify/function/media-conversion/package.json`):
```json
{
  "name": "media-conversion",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "sharp": "^0.33.5"
  }
}
```

**File Filter Lambda** (`amplify/function/file-filter/package.json`):
```json
{
  "name": "file-filter",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "sharp": "^0.33.5"
  }
}
```

**File Conversion Lambda** (`amplify/function/file-conversion/package.json`):
```json
{
  "name": "file-conversion",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "xlsx": "^0.18.5"
  }
}
```

### 2. Increased Lambda Resources

Updated all Lambda resource configurations with better timeout and memory:

**All Lambda functions now have:**
- `timeoutSeconds: 300` (5 minutes)
- `memoryMB: 1024` (1GB RAM)

**Files updated:**
- `amplify/function/media-conversion/resource.ts`
- `amplify/function/file-filter/resource.ts`
- `amplify/function/file-conversion/resource.ts`

---

## Why This Fixes Sharp

### The Problem
Sharp is a native Node.js module with platform-specific binaries. When installed on macOS/Windows for development, it downloads binaries for that platform. But AWS Lambda runs on Linux x64, so it needs Linux binaries.

### The Solution
By creating a `package.json` in each Lambda function directory:
1. Amplify Gen2 will run `npm install` **inside the Lambda build environment** (Linux x64)
2. Sharp will detect it's running in a Linux environment
3. Sharp will download the correct linux-x64 binaries
4. These binaries get packaged with the Lambda deployment

---

## Next Steps: Redeploy Amplify

### Option 1: Sandbox (Development)
```bash
npx ampx sandbox
```

This will:
- Rebuild all Lambda functions with new package.json files
- Install Sharp with correct Linux binaries
- Deploy to your sandbox environment

### Option 2: Production Deploy
```bash
npx ampx pipeline-deploy --branch main
```

Or push to your Git repository if you have CI/CD configured.

---

## Verification

After redeploying, test the conversion:

1. **Test Image Conversion (JPG → PNG)**
   - Go to `/media-converters/image`
   - Upload a JPG file
   - Convert to PNG
   - Should work without Sharp errors

2. **Check Logs in CloudWatch**
   - If it still fails, check Lambda logs
   - Look for different error messages
   - Sharp should load successfully now

3. **Test All Conversion Types**
   - File conversions (PDF, DOCX, etc.)
   - Media conversions (images, video, audio)
   - Filters (blur, grayscale, etc.)

---

## Files Created/Modified

### Created:
- `amplify/function/media-conversion/package.json`
- `amplify/function/file-filter/package.json`
- `amplify/function/file-conversion/package.json`

### Modified:
- `amplify/function/media-conversion/resource.ts` - Added timeout/memory
- `amplify/function/file-filter/resource.ts` - Added timeout/memory
- `amplify/function/file-conversion/resource.ts` - Added timeout/memory

---

## Additional Notes

### Sharp Version
Using `^0.33.5` which is compatible with:
- Node.js 18.x (Lambda default)
- AWS Lambda Linux x64 runtime
- Latest security patches

### Memory & Timeout
- **1GB RAM**: Sufficient for image processing
- **5min timeout**: Handles large files and slow conversions
- Can be adjusted if needed

### Future Deployments
Every time you deploy with Amplify, it will:
1. Read each Lambda's `package.json`
2. Install dependencies in Linux environment
3. Package with correct binaries
4. Deploy to AWS

No manual intervention needed after initial redeploy.

---

**Status:** ✅ Configuration Fixed - Waiting for Redeploy
