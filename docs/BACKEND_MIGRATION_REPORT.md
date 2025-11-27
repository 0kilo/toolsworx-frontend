# Backend Migration Report: Amplify Gen2 Integration

**Report Date:** 2025-11-27
**Report Type:** Backend API Integration Review
**Status:** ⚠️ CRITICAL ISSUES FOUND

---

## Executive Summary

This report analyzes the migration from the old backend API to AWS Amplify Gen2. The review covers:
- ✅ Amplify Lambda functions (correct implementation)
- ✅ Frontend service calls (correctly using Amplify)
- ⚠️ **Amplify client implementation (CRITICAL BUGS)**
- ✅ Old API identification (not in use, but still present)

**Key Findings:**
- **3 Lambda functions** are correctly implemented and return proper responses
- **2 frontend components** correctly call Amplify endpoints
- **5 CRITICAL BUGS** in the Amplify client that prevent downloads from working
- **1 old API client** still exists but is not used by frontend
- **1 old backend server** still exists in the codebase

---

## 1. Amplify Lambda Functions Review

### ✅ Status: All Lambda functions correctly return converted files

All three Lambda functions properly convert files and return the result as base64 data URIs.

#### 1.1 File Conversion Lambda
**Location:** `amplify/function/file-conversion/handler.ts`

**Returns:**
```typescript
{
  success: true,
  downloadUrl: `data:${getContentType(targetFormat)};base64,${base64Output}`
}
```

**Supports:**
- Document formats: PDF, DOC, DOCX, ODT, RTF, TXT, HTML (using LibreOffice)
- Spreadsheet formats: XLSX, XLS, CSV, ODS (using xlsx library)

**✅ CORRECT:** Returns the converted file as a base64 data URI in the response

---

#### 1.2 Media Conversion Lambda
**Location:** `amplify/function/media-conversion/handler.ts`

**Returns:**
```typescript
{
  success: true,
  jobId: string,
  downloadUrl: `data:${getContentType(targetFormat)};base64,${base64Output}`
}
```

**Supports:**
- Image formats: JPG, JPEG, PNG, WebP, GIF, BMP, TIFF (using Sharp)
- Video/Audio formats: Various (using FFmpeg)

**✅ CORRECT:** Returns the converted file as a base64 data URI in the response

---

#### 1.3 File Filter Lambda
**Location:** `amplify/function/file-filter/handler.ts`

**Returns:**
```typescript
{
  success: true,
  jobId: string,
  downloadUrl: `data:image/${outputFormat};base64,${base64Output}`,
  appliedFilters: string[]
}
```

**Supports:**
- Image filters: grayscale, blur, sharpen, brightness, contrast, saturation, hue, sepia, vintage, resize, rotate, flip, flop, negate, normalize

**✅ CORRECT:** Returns the filtered file as a base64 data URI in the response

---

## 2. Amplify GraphQL Schema

**Location:** `amplify/data/resource.ts`

**Queries Defined:**
1. `fileConversion` - Calls file-conversion Lambda
2. `mediaConversion` - Calls media-conversion Lambda
3. `fileFilter` - Calls file-filter Lambda

**Authorization:** Guest access enabled for all queries

**✅ CORRECT:** Schema properly defined and connected to Lambda functions

---

## 3. Frontend Integration Review

### ✅ Frontend components correctly use Amplify

#### 3.1 File Converter Component
**Location:** `components/shared/file-converter.tsx`

**Uses:** `amplifyApiClient`

**Methods Called:**
- `amplifyApiClient.convertFile()` (line 68)
- `amplifyApiClient.getFileJobStatus()` (line 79)
- `amplifyApiClient.downloadFileJob()` (line 125)

**✅ CORRECT:** Component uses Amplify client, not old API client

---

#### 3.2 Media Converter Component
**Location:** `components/shared/media-converter.tsx`

**Uses:** `amplifyApiClient`

**Methods Called:**
- `amplifyApiClient.convertMedia()` (line 68)
- `amplifyApiClient.getMediaJobStatus()` (line 79)
- `amplifyApiClient.downloadMediaJob()` (line 125)

**✅ CORRECT:** Component uses Amplify client, not old API client

---

#### 3.3 Pages Using Converters

**File Converter Pages:**
- `app/file-converters/documents/page.tsx` - Uses `<FileConverter>` component
- `app/file-converters/spreadsheet/page.tsx` - Uses `<FileConverter>` component
- `app/file-converters/data/page.tsx` - Uses `<FileConverter>` component
- `app/file-converters/archive/page.tsx` - Uses `<FileConverter>` component
- `app/file-converters/base64/page.tsx` - Uses `<FileConverter>` component

**Media Converter Pages:**
- `app/media-converters/image/client.tsx` - Uses `<MediaConverter>` component
- `app/media-converters/audio/page.tsx` - Uses `<MediaConverter>` component
- `app/media-converters/video/page.tsx` - Uses `<MediaConverter>` component

**Filter Pages:**
- Most filter pages (`app/filters/*/page.tsx`) - Placeholder UI only, no backend calls yet

**✅ CORRECT:** All active converter pages use Amplify-based components

---

## 4. ⚠️ CRITICAL BUGS IN AMPLIFY CLIENT

**Location:** `lib/services/amplify-client.ts`

### 🔴 BUG #1: `convertFile()` does not store job in completedJobs map

**Method:** `convertFile()` (lines 40-61)

**Issue:**
```typescript
async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
  // ... conversion logic ...

  return {
    id: crypto.randomUUID(),
    status: 'completed',
    progress: 100,
    downloadUrl: (data as any).downloadUrl  // ✅ Has downloadUrl
  }
  // ❌ DOES NOT store in this.completedJobs
}
```

**Impact:**
- Job is returned with correct `downloadUrl`
- But job is NOT stored in `completedJobs` map
- Later calls to `downloadFileJob()` will fail with "Job not found"

**Fix Required:**
```typescript
async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
  const jobId = crypto.randomUUID()  // Move up
  // ... conversion logic ...

  const job = {
    id: jobId,
    status: 'completed' as const,
    progress: 100,
    downloadUrl: (data as any).downloadUrl
  }

  this.completedJobs.set(job.id, job)  // ✅ ADD THIS LINE
  return job
}
```

---

### 🔴 BUG #2: `getFileJobStatus()` returns empty downloadUrl

**Method:** `getFileJobStatus()` (lines 63-70)

**Issue:**
```typescript
async getFileJobStatus(jobId: string): Promise<ConversionJob> {
  return {
    id: jobId,
    status: 'completed',
    progress: 100,
    downloadUrl: ''  // ❌ ALWAYS RETURNS EMPTY STRING
  }
}
```

**Impact:**
- Frontend polls this method to check conversion status
- When status is 'completed', it expects downloadUrl to be populated
- Returns empty string, causing download to fail

**Fix Required:**
```typescript
async getFileJobStatus(jobId: string): Promise<ConversionJob> {
  const job = this.completedJobs.get(jobId)
  if (!job) {
    throw new Error('Job not found')
  }
  return job  // ✅ Return the stored job with downloadUrl
}
```

---

### 🔴 BUG #3: `getMediaJobStatus()` returns empty downloadUrl

**Method:** `getMediaJobStatus()` (lines 72-79)

**Issue:**
```typescript
async getMediaJobStatus(jobId: string): Promise<ConversionJob> {
  return {
    id: jobId,
    status: 'completed',
    progress: 100,
    downloadUrl: ''  // ❌ ALWAYS RETURNS EMPTY STRING
  }
}
```

**Impact:** Same as Bug #2 - download will fail

**Fix Required:** Same as Bug #2

---

### 🔴 BUG #4: `downloadFileJob()` won't work due to Bug #1

**Method:** `downloadFileJob()` (lines 81-90)

**Issue:**
```typescript
async downloadFileJob(jobId: string): Promise<Blob> {
  const job = this.completedJobs.get(jobId)  // ❌ Will be undefined due to Bug #1
  if (!job?.downloadUrl) {
    throw new Error('Job not found or no download URL')  // ❌ Will always throw
  }

  const response = await fetch(job.downloadUrl)
  return response.blob()
}
```

**Impact:**
- Will ALWAYS throw "Job not found or no download URL"
- `convertFile()` never stores the job in `completedJobs`

**Fix Required:** Bug #1 must be fixed first

---

### 🔴 BUG #5: `downloadMediaJob()` returns empty Blob

**Method:** `downloadMediaJob()` (lines 94-96)

**Issue:**
```typescript
async downloadMediaJob(jobId: string): Promise<Blob> {
  return new Blob()  // ❌ ALWAYS RETURNS EMPTY BLOB
}
```

**Impact:**
- Download will appear to succeed
- But downloaded file will be empty (0 bytes)

**Fix Required:**
```typescript
async downloadMediaJob(jobId: string): Promise<Blob> {
  const job = this.completedJobs.get(jobId)
  if (!job?.downloadUrl) {
    throw new Error('Job not found or no download URL')
  }

  const response = await fetch(job.downloadUrl)
  return response.blob()
}
```

---

## 5. Old Backend Components (Not in Use)

### ⚠️ Old API Client (Not Used by Frontend)

**Location:** `lib/services/api-client.ts`

**Endpoints Called:**
- `/api/convert` - Old file conversion endpoint
- `/api/status/:jobId` - Old file status endpoint
- `/api/download/:jobId` - Old file download endpoint
- `/api/media/convert` - Old media conversion endpoint
- `/api/media/status/:jobId` - Old media status endpoint
- `/api/media/download/:jobId` - Old media download endpoint
- `/api/filter/apply` - Old filter endpoint

**Usage Status:**
- ❌ **NOT imported by any frontend components**
- ❌ **NOT imported by any pages**
- ✅ Only exists in the codebase, not actively used

**Recommendation:** Delete this file to avoid confusion

---

### ⚠️ Old Backend Server (Deprecated)

**Location:** `backend/unified-service/server.js`

**Implements:**
- Express server with old API endpoints
- Uses Redis for job queue
- Uses Bull for job processing
- Implements file conversion with LibreOffice
- Implements media conversion with FFmpeg/Sharp
- Implements filter processing with Sharp

**Usage Status:**
- ❌ **NOT called by current frontend**
- ❌ **Replaced by Amplify Lambda functions**
- ⚠️ Still exists in codebase

**Recommendation:** Move to a separate folder (e.g., `backend-deprecated/`) to avoid confusion

---

## 6. Conversion Service Wrapper (Not Used)

**Location:** `lib/services/conversion-service.ts`

**Purpose:** Wrapper around `amplify-client.ts`

**Usage Status:**
- ❌ **NOT imported by any components**
- ❌ **NOT imported by any pages**

**Recommendation:** Delete this file as it's redundant

---

## 7. Summary of Issues

### Critical Issues (Must Fix)
1. ✅ **Bug #1:** `convertFile()` must store job in `completedJobs` map
2. ✅ **Bug #2:** `getFileJobStatus()` must return stored job with downloadUrl
3. ✅ **Bug #3:** `getMediaJobStatus()` must return stored job with downloadUrl
4. ✅ **Bug #4:** Will be fixed when Bug #1 is fixed
5. ✅ **Bug #5:** `downloadMediaJob()` must fetch from stored job's downloadUrl

### Cleanup Tasks (Should Do)
1. Delete `lib/services/api-client.ts` (not used)
2. Delete `lib/services/conversion-service.ts` (not used)
3. Move `backend/unified-service/` to `backend-deprecated/` (not used)

### Working Correctly
1. ✅ All 3 Amplify Lambda functions return correct responses
2. ✅ Frontend components use `amplifyApiClient` (not old API)
3. ✅ Amplify GraphQL schema properly defined
4. ✅ No frontend code uses old API endpoints

---

## 8. Detailed Fix Recommendations

### Fix #1: Update `amplify-client.ts`

Replace the entire file with the corrected version:

```typescript
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

export interface ConversionJob {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress?: number
  downloadUrl?: string
  error?: string
}

class AmplifyApiClient {
  private token: string | null = null
  private completedJobs = new Map<string, ConversionJob>()

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  loadToken() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
      }
    }
  }

  async convertFile(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data } = await client.queries.fileConversion({
      fileData: base64Data,
      fileName: file.name,
      targetFormat,
      options
    })

    if (!data) {
      throw new Error('Conversion failed - no response from server')
    }

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: (data as any).downloadUrl
    }

    this.completedJobs.set(job.id, job)
    return job
  }

  async getFileJobStatus(jobId: string): Promise<ConversionJob> {
    const job = this.completedJobs.get(jobId)
    if (!job) {
      throw new Error('Job not found')
    }
    return job
  }

  async getMediaJobStatus(jobId: string): Promise<ConversionJob> {
    const job = this.completedJobs.get(jobId)
    if (!job) {
      throw new Error('Job not found')
    }
    return job
  }

  async downloadFileJob(jobId: string): Promise<Blob> {
    const job = this.completedJobs.get(jobId)
    if (!job?.downloadUrl) {
      throw new Error('Job not found or no download URL')
    }

    const response = await fetch(job.downloadUrl)
    return response.blob()
  }

  async downloadMediaJob(jobId: string): Promise<Blob> {
    const job = this.completedJobs.get(jobId)
    if (!job?.downloadUrl) {
      throw new Error('Job not found or no download URL')
    }

    const response = await fetch(job.downloadUrl)
    return response.blob()
  }

  async convertMedia(file: File, targetFormat: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data } = await client.queries.mediaConversion({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      targetFormat,
      options
    })

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: (data as any).downloadUrl
    }

    this.completedJobs.set(job.id, job)
    return job
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionJob> {
    const jobId = crypto.randomUUID()
    const fileBuffer = await file.arrayBuffer()
    const base64Data = Buffer.from(fileBuffer).toString('base64')

    const { data } = await client.queries.fileFilter({
      jobId,
      fileData: base64Data,
      fileName: file.name,
      options: { type: filterType, ...options }
    })

    const job = {
      id: jobId,
      status: 'completed' as const,
      progress: 100,
      downloadUrl: (data as any).downloadUrl
    }

    this.completedJobs.set(job.id, job)
    return job
  }

  async request<T = any>(config: any): Promise<any> {
    return { data: null }
  }
}

export const amplifyApiClient = new AmplifyApiClient()

if (typeof window !== 'undefined') {
  amplifyApiClient.loadToken()
}
```

### Fix #2: Delete Old Files

```bash
# Delete unused old API client
rm lib/services/api-client.ts

# Delete unused conversion service wrapper
rm lib/services/conversion-service.ts

# Move old backend to deprecated folder
mkdir -p backend-deprecated
mv backend/unified-service backend-deprecated/
```

---

## 9. Testing Recommendations

After applying fixes, test the following scenarios:

### File Conversion Test
1. Upload a PDF file
2. Select Word (DOCX) as target format
3. Click "Convert"
4. Verify progress indicator shows
5. Verify "Conversion completed!" message appears
6. Click "Download" button
7. Verify downloaded file is valid DOCX (not empty)

### Media Conversion Test
1. Upload a PNG image
2. Select JPEG as target format
3. Click "Convert"
4. Verify progress indicator shows
5. Verify "Conversion completed!" message appears
6. Click "Download" button
7. Verify downloaded file is valid JPEG (not empty)

### Filter Test
1. Upload an image
2. Apply a filter (e.g., grayscale)
3. Click "Apply"
4. Verify progress indicator shows
5. Verify "Conversion completed!" message appears
6. Click "Download" button
7. Verify downloaded file shows filter applied (not empty)

---

## 10. Conclusion

**Migration Status:** ⚠️ INCOMPLETE - Critical bugs prevent downloads from working

**Key Achievements:**
- ✅ Amplify Lambda functions correctly implemented
- ✅ Frontend components correctly integrated with Amplify
- ✅ Old API client is not being used

**Remaining Work:**
- 🔴 Fix 5 critical bugs in `amplify-client.ts`
- 🟡 Delete 2 unused service files
- 🟡 Move old backend to deprecated folder

**Estimated Fix Time:** 1-2 hours

**Priority:** HIGH - Downloads are currently broken for all file, media, and filter conversions

---

## Appendix A: Method Locations Reference

### Amplify Client Methods
- `convertFile()` - `lib/services/amplify-client.ts:40-61`
- `getFileJobStatus()` - `lib/services/amplify-client.ts:63-70`
- `downloadFileJob()` - `lib/services/amplify-client.ts:81-90`
- `convertMedia()` - `lib/services/amplify-client.ts:98-120`
- `getMediaJobStatus()` - `lib/services/amplify-client.ts:72-79`
- `downloadMediaJob()` - `lib/services/amplify-client.ts:94-96`
- `applyFilter()` - `lib/services/amplify-client.ts:122-143`

### Lambda Functions
- File Conversion Handler - `amplify/function/file-conversion/handler.ts`
- Media Conversion Handler - `amplify/function/media-conversion/handler.ts`
- File Filter Handler - `amplify/function/file-filter/handler.ts`

### Frontend Components
- File Converter - `components/shared/file-converter.tsx`
- Media Converter - `components/shared/media-converter.tsx`

### Deprecated Files
- Old API Client - `lib/services/api-client.ts` (DELETE)
- Conversion Service - `lib/services/conversion-service.ts` (DELETE)
- Old Backend Server - `backend/unified-service/server.js` (MOVE TO DEPRECATED)
