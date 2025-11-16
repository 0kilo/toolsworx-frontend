import { defineFunction } from '@aws-amplify/backend';

export const filterService = defineFunction({
  name: 'filter-service',
  entry: './handler.ts',
  runtime: 'nodejs18.x',
  timeoutSeconds: 60,
  memoryMB: 512,
  environment: {
    STORAGE_BUCKET: 'convert-all-storage'
  }
});