import { defineFunction } from '@aws-amplify/backend';

export const filterService = defineFunction({
  name: 'filterService',
  entry: './handler.ts',
  timeoutSeconds: 300,
  memoryMB: 1024
});