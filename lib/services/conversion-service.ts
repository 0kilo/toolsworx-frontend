import { apiClient } from './api-client';

export interface ConversionRequest {
  file: File;
  targetFormat: string;
  options?: Record<string, any>;
}

export interface ConversionResult {
  success: boolean;
  jobId: string;
  downloadUrl: string;
  error?: string;
}

export class ConversionService {
  async convertFile(request: ConversionRequest): Promise<ConversionResult> {
    const job = await apiClient.convertFile(request.file, request.targetFormat, request.options);
    return {
      success: true,
      jobId: job.id,
      downloadUrl: job.downloadUrl || '',
    };
  }

  async convertMedia(request: ConversionRequest): Promise<ConversionResult> {
    const job = await apiClient.convertMedia(request.file, request.targetFormat, request.options);
    return {
      success: true,
      jobId: job.id,
      downloadUrl: job.downloadUrl || '',
    };
  }

  async applyFilter(file: File, filterType: string, options?: any): Promise<ConversionResult> {
    const job = await apiClient.applyFilter(file, filterType, options);
    return {
      success: true,
      jobId: job.id,
      downloadUrl: job.downloadUrl || '',
    };
  }
}