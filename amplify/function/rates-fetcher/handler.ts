import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

interface CurrencyRate {
  currencyPair: string;
  name: string;
  rate: number;
  timestamp: number;
  baseCurrency: string;
  quoteCurrency: string;
  active: boolean;
  market: string;
}

interface CryptoPrice {
  symbol: string;
  name: string;
  price: number;
  timestamp: number;
  volume24h?: number;
  marketCap?: number;
  change24h?: number;
}

export const handler = async (event: any) => {
  console.log('Starting rates fetcher...', event);

  const tableName = process.env.MARKET_RATE_TABLE;

  if (!tableName) {
    throw new Error('Table name not configured');
  }

  try {
    console.log('Fetching currency rates...');
    const currencyData = await fetchCurrencyRates();
    console.log(`Fetched ${currencyData} currency rates`);
    
    console.log('Fetching crypto prices...');
    const cryptoData = await fetchCryptoPrices();
    console.log(`Fetched ${cryptoData} crypto prices`);

    console.log('Storing currency rates...');
    await storeCurrencyRates(tableName, currencyData);
    console.log('Currency rates stored');
    
    console.log('Storing crypto prices...');
    await storeCryptoPrices(tableName, cryptoData);
    console.log('Crypto prices stored');

    console.log(`Successfully stored ${currencyData.length} currency rates and ${cryptoData.length} crypto prices`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Rates updated successfully',
        currencyCount: currencyData.length,
        cryptoCount: cryptoData.length,
        timestamp: Date.now()
      })
    };
  } catch (error) {
    console.error('Error fetching rates:', error);
    throw error;
  }
};

async function fetchCurrencyRates(): Promise<any[]> {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');

    if (!response.ok) {
      throw new Error(`ExchangeRate API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return Object.entries(data.rates).map(([currency, rate]) => ({
      base: data.base,
      currency,
      rate
    }));
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    throw error;
  }
}

async function fetchCryptoPrices(): Promise<any[]> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,usd-coin,cardano,dogecoin,tron&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false');

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const symbolMap: Record<string, string> = {
      'bitcoin': 'BTC',
      'ethereum': 'ETH',
      'binancecoin': 'BNB',
      'ripple': 'XRP',
      'cardano': 'ADA',
      'dogecoin': 'DOGE',
      'solana': 'SOL',
      'tether': 'USDT',
      'tron': 'TRX',
      'usd-coin': 'USDC'
    };
    return Object.entries(data).map(([id, price]: [string, any]) => ({
      id,
      symbol: symbolMap[id] || id.substring(0, 3).toUpperCase(),
      name: id,
      priceUsd: price.usd
    }));
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
}

async function storeCurrencyRates(tableName: string, rates: any[]) {
  if (rates.length === 0) return;

  const timestamp = Date.now();
  const ttl = Math.floor(timestamp / 1000) + (30 * 86400);

  const batches = [];
  for (let i = 0; i < rates.length; i += 25) {
    const batch = rates.slice(i, i + 25);
    batches.push(
      ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map(r => ({
            PutRequest: {
              Item: {
                pk: `CURRENCY#${r.currency}`,
                sk: `TIMESTAMP#${timestamp}`,
                type: 'CURRENCY',
                symbol: r.currency,
                name: r.currency,
                price: r.rate,
                timestamp,
                gsi1pk: 'LATEST_RATES',
                ttl,
                rawData: r
              }
            }
          }))
        }
      }))
    );
  }

  await Promise.all(batches);
}

async function storeCryptoPrices(tableName: string, prices: any[]) {
  if (prices.length === 0) return;

  const timestamp = Date.now();
  const ttl = Math.floor(timestamp / 1000) + (30 * 86400);

  const batches = [];
  for (let i = 0; i < prices.length; i += 25) {
    const batch = prices.slice(i, i + 25);
    batches.push(
      ddbDocClient.send(new BatchWriteCommand({
        RequestItems: {
          [tableName]: batch.map(crypto => ({
            PutRequest: {
              Item: {
                pk: `CRYPTO#${crypto.symbol?.toUpperCase()}`,
                sk: `TIMESTAMP#${timestamp}`,
                type: 'CRYPTO',
                symbol: crypto.symbol?.toUpperCase(),
                name: crypto.name,
                price: parseFloat(crypto.priceUsd) || 0,
                timestamp,
                gsi1pk: 'LATEST_CRYPTO',
                ttl,
                rawData: crypto
              }
            }
          }))
        }
      }))
    );
  }

  await Promise.all(batches);
}
