import { defineFunction } from '@aws-amplify/backend';

export const shippingCost = defineFunction({
  name: 'shippingCost',
  entry: './handler.ts',
  timeoutSeconds: 30,
  memoryMB: 512
});
