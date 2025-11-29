import { defineFunction } from '@aws-amplify/backend';

export const audioFilter = defineFunction({
  name: 'audioFilter',
  entry: './handler.ts',
  timeoutSeconds: 300,
  memoryMB: 2048
});
