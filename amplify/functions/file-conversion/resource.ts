import { defineFunction } from '@aws-amplify/backend';

export const fileConversion = defineFunction({
  name: 'file-conversion',
  entry: './handler.ts',
  runtime: 'nodejs18.x',
  timeoutSeconds: 300,
  memoryMB: 1024,
  environment: {
    STORAGE_BUCKET: 'convert-all-storage'
  }
});