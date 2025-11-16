import { defineFunction } from '@aws-amplify/backend';

export const mediaConversion = defineFunction({
  name: 'media-conversion',
  entry: './handler.ts',
  runtime: 'nodejs18.x',
  timeoutSeconds: 300,
  memoryMB: 2048,
  environment: {
    STORAGE_BUCKET: 'convert-all-storage'
  }
});