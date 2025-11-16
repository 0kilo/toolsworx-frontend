import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  fileConversion: a
    .query()
    .arguments({
      fileData: a.string().required(),
      fileName: a.string().required(),
      targetFormat: a.string().required(),
      options: a.json()
    })
    .returns(a.json())
    .handler(a.handler.function('fileConversion')),

  mediaConversion: a
    .query()
    .arguments({
      fileData: a.string().required(),
      fileName: a.string().required(),
      targetFormat: a.string().required(),
      options: a.json()
    })
    .returns(a.json())
    .handler(a.handler.function('mediaConversion')),

  filterService: a
    .query()
    .arguments({
      fileData: a.string().required(),
      fileName: a.string().required(),
      filters: a.json().required(),
      outputFormat: a.string()
    })
    .returns(a.json())
    .handler(a.handler.function('filterService'))
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey'
  }
});