import { defineFunction } from '@aws-amplify/backend';

export const ratesFetcher = defineFunction({
  name: 'rates-fetcher',
  entry: './handler.ts',
  timeoutSeconds: 60,
  resourceGroupName: 'data'
});
