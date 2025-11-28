import { defineFunction } from '@aws-amplify/backend';

export const fileConversion = defineFunction({
  name: 'fileConversion',
  entry: './handler.ts',
  timeoutSeconds: 300,
  memoryMB: 1024
});