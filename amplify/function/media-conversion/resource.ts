import { defineFunction } from '@aws-amplify/backend';

export const mediaConversion = defineFunction({
  name: 'mediaConversion',
  entry: './handler.ts',
  timeoutSeconds: 300,
  memoryMB: 1024
});