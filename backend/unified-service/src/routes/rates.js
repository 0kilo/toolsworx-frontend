const express = require('express');

async function fetchCurrencyRates() {
  const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
  if (!response.ok) throw new Error(`ExchangeRate API error: ${response.status} ${response.statusText}`);
  const data = await response.json();
  return Object.entries(data.rates).map(([currency, rate]) => ({
    base: data.base,
    currency,
    rate,
    timestamp: data.time_last_updated || Date.now(),
  }));
}

async function fetchCryptoPrices() {
  const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,binancecoin,solana,ripple,usd-coin,cardano,dogecoin,tron&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false');
  if (!response.ok) throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  const data = await response.json();
  const symbolMap = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    binancecoin: 'BNB',
    ripple: 'XRP',
    cardano: 'ADA',
    dogecoin: 'DOGE',
    solana: 'SOL',
    tether: 'USDT',
    tron: 'TRX',
    'usd-coin': 'USDC',
  };
  const now = Date.now();
  return Object.entries(data).map(([id, price]) => ({
    id,
    symbol: symbolMap[id] || id.substring(0, 3).toUpperCase(),
    name: id,
    priceUsd: price.usd,
    timestamp: now,
  }));
}

module.exports = ({ logger }) => {
  const router = express.Router();

  router.get('/api/rates/currency', async (req, res) => {
    try {
      const rates = await fetchCurrencyRates();
      res.json({ success: true, count: rates.length, rates });
    } catch (error) {
      logger.error({ error }, 'Currency rates error');
      res.status(500).json({ success: false, error: error.message });
    }
  });

  router.get('/api/rates/crypto', async (req, res) => {
    try {
      const prices = await fetchCryptoPrices();
      res.json({ success: true, count: prices.length, prices });
    } catch (error) {
      logger.error({ error }, 'Crypto rates error');
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
};
