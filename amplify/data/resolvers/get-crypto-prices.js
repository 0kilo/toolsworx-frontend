export function request(ctx) {
  const { symbol } = ctx.args;

  return {
    operation: 'Query',
    query: {
      expression: 'pk = :pk',
      expressionValues: {
        ':pk': { S: `CRYPTO#${symbol.toUpperCase()}` }
      }
    },
    scanIndexForward: false,
    limit: 1
  };
}

export function response(ctx) {
  if (ctx.error) {
    console.error('Resolver error:', ctx.error);
    util.error(ctx.error.message, ctx.error.type);
  }

  const items = ctx.result.items || [];
  if (items.length === 0) return {};
  
  const item = items[0];
  return {
    symbol: item.symbol,
    name: item.name,
    price: item.price,
    timestamp: item.timestamp,
    type: item.type
  };
}
