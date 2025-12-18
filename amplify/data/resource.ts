// import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
// import { fileConversion } from '../function/file-conversion/resource';
// import { filterService } from '../function/file-filter/resource';
// import { mediaConversion } from '../function/media-conversion/resource';
// import { audioFilter } from '../function/audio-filter/resource';
// import { shippingCost } from '../function/shipping-cost/resource';
// // import { currencyConverter } from '../function/currency-converter/resource';
// // import { cryptoConverter } from '../function/crypto-converter/resource';
// /*== STEP 1 ===============================================================
// The section below creates a Todo database table with a "content" field. Try
// adding a new "isDone" field as a boolean. The authorization rule below
// specifies that any unauthenticated user can "create", "read", "update", 
// and "delete" any "Todo" records.
// =========================================================================*/
// const schema = a.schema({
//   // Single table design for both currency rates and crypto prices
//   MarketRate: a.model({
//     pk: a.string().required(), // CURRENCY#{currencyPair} or CRYPTO#{symbol}
//     sk: a.string().required(), // TIMESTAMP#{timestamp}
//     type: a.string().required(), // 'CURRENCY' or 'CRYPTO'
//     symbol: a.string(), // For crypto: BTC, ETH, etc. For currency: the pair like USD/EUR
//     name: a.string(),
//     price: a.float().required(), // Rate for currency, price for crypto
//     timestamp: a.integer().required(),
//     baseCurrency: a.string(), // For currency pairs
//     quoteCurrency: a.string(), // For currency pairs
//     volume24h: a.float(), // For crypto
//     marketCap: a.float(), // For crypto
//     change24h: a.float(), // For crypto
//     active: a.boolean(),
//     market: a.string(),
//     gsi1pk: a.string(), // 'LATEST_RATES' or 'LATEST_CRYPTO' for GSI queries
//   })
//   .authorization(allow => [allow.publicApiKey()])
//   .identifier(['pk', 'sk'])
//   .secondaryIndexes(index => [
//     index('type').sortKeys(['timestamp']).queryField('listByType'),
//     index('symbol').sortKeys(['timestamp']).queryField('listBySymbol'),
//     index('gsi1pk').sortKeys(['timestamp']).queryField('listLatest')
//   ]),

//   fileConversion: a
//   .query()
//   .arguments({
//     fileData: a.string(),
//     fileName: a.string(),
//     targetFormat: a.string(),
//     options: a.json()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(a.handler.function(fileConversion)),

//   fileFilter: a
//   .query()
//   .arguments({
//     jobId: a.string(),
//     fileData: a.string(),
//     fileName: a.string(),
//     options: a.json()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(a.handler.function(filterService)),

//   mediaConversion: a
//   .query()
//   .arguments({
//     jobId: a.string(),
//     fileData: a.string(),
//     fileName: a.string(),
//     targetFormat: a.string(),
//     options: a.json()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(a.handler.function(mediaConversion)),

//   audioFilter: a
//   .query()
//   .arguments({
//     jobId: a.string(),
//     fileData: a.string(),
//     fileName: a.string(),
//     filterType: a.string(),
//     options: a.json()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(a.handler.function(audioFilter)),

//   shippingCost: a
//   .query()
//   .arguments({
//     origin: a.string(),
//     destination: a.string(),
//     weight: a.float(),
//     dimensions: a.json(),
//     carrier: a.string()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(a.handler.function(shippingCost)),


//   getCurrencyRate: a
//   .query()
//   .arguments({
//     currency: a.string().required()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(
//     a.handler.custom({
//       dataSource: a.ref('MarketRate'),
//       entry: './resolvers/get-currency-rates.js'
//     })
//   ),

//   getCryptoPrice: a
//   .query()
//   .arguments({
//     symbol: a.string().required()
//   })
//   .returns(a.json())
//   .authorization(allow => [allow.publicApiKey()])
//   .handler(
//     a.handler.custom({
//       dataSource: a.ref('MarketRate'),
//       entry: './resolvers/get-crypto-prices.js'
//     })
// )

// });

// export type Schema = ClientSchema<typeof schema>;

// export const data = defineData({
//   schema,
//   authorizationModes: {
//     defaultAuthorizationMode: 'apiKey'  
//   }
// });

// /*== STEP 2 ===============================================================
// Go to your frontend source code. From your client-side code, generate a
// Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
// WORK IN THE FRONTEND CODE FILE.)

// Using JavaScript or Next.js React Server Components, Middleware, Server 
// Actions or Pages Router? Review how to generate Data clients for those use
// cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
// =========================================================================*/

// /*
// "use client"
// import { generateClient } from "aws-amplify/data";
// import type { Schema } from "@/amplify/data/resource";

// const client = generateClient<Schema>() // use this Data client for CRUDL requests
// */

// /*== STEP 3 ===============================================================
// Fetch records from the database and use them in your frontend component.
// (THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
// =========================================================================*/

// /* For example, in a React component, you can use this snippet in your
//   function's RETURN statement */
// // const { data: todos } = await client.models.Todo.list()

// // return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
