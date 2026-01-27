const express = require('express');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { createMcpServer } = require('../mcp/server');
const { extractApiKey, isApiKeyValid } = require('../mcp/auth');

module.exports = ({ logger }) => {
  const router = express.Router();

  router.post('/mcp', async (req, res) => {
    const apiKey = extractApiKey(req);
    if (!apiKey) {
      return res.status(401).json({
        jsonrpc: '2.0',
        error: { code: -32001, message: 'Missing API key.' },
        id: null
      });
    }

    try {
      const valid = await isApiKeyValid(apiKey);
      if (!valid) {
        return res.status(401).json({
          jsonrpc: '2.0',
          error: { code: -32001, message: 'Invalid API key.' },
          id: null
        });
      }
    } catch (error) {
      logger.error({ error }, 'Failed to validate MCP API key');
      return res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'API key validation failed.' },
        id: null
      });
    }

    const server = createMcpServer();
    try {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on('close', () => {
        transport.close();
        server.close();
      });
    } catch (error) {
      logger.error({ error }, 'MCP request error');
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: { code: -32603, message: 'Internal server error.' },
          id: null
        });
      }
    }
  });

  router.get('/mcp', (req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null
    });
  });

  router.delete('/mcp', (req, res) => {
    res.status(405).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed.' },
      id: null
    });
  });

  return router;
};
