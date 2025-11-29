import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { fileConversion } from '../function/file-conversion/resource';
import { filterService } from '../function/file-filter/resource';
import { mediaConversion } from '../function/media-conversion/resource';
import { audioFilter } from '../function/audio-filter/resource';
import { shippingCost } from '../function/shipping-cost/resource';
/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  fileConversion: a
  .query()
  .arguments({
    fileData: a.string(), 
    fileName: a.string(), 
    targetFormat: a.string(), 
    options: a.json()
  })
  .returns(a.json())
  .authorization(allow => [allow.publicApiKey()])
  .handler(a.handler.function(fileConversion)),

  fileFilter: a
  .query()
  .arguments({
    jobId: a.string(),
    fileData: a.string(),
    fileName: a.string(),
    options: a.json()
  })
  .returns(a.json())
  .authorization(allow => [allow.publicApiKey()])
  .handler(a.handler.function(filterService)),

  mediaConversion: a
  .query()
  .arguments({
    jobId: a.string(),
    fileData: a.string(),
    fileName: a.string(),
    targetFormat: a.string(),
    options: a.json()
  })
  .returns(a.json())
  .authorization(allow => [allow.publicApiKey()])
  .handler(a.handler.function(mediaConversion)),

  audioFilter: a
  .query()
  .arguments({
    jobId: a.string(),
    fileData: a.string(),
    fileName: a.string(),
    filterType: a.string(),
    options: a.json()
  })
  .returns(a.json())
  .authorization(allow => [allow.publicApiKey()])
  .handler(a.handler.function(audioFilter)),

  shippingCost: a
  .query()
  .arguments({
    origin: a.string(),
    destination: a.string(),
    weight: a.float(),
    dimensions: a.json(),
    carrier: a.string()
  })
  .returns(a.json())
  .authorization(allow => [allow.publicApiKey()])
  .handler(a.handler.function(shippingCost))

});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey'
  
  }
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
