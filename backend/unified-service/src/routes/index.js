const express = require('express');
const healthRoutes = require('./health');
const fileRoutes = require('./file');
const mediaRoutes = require('./media');
const filterRoutes = require('./filter');
const audioRoutes = require('./audio');
const ratesRoutes = require('./rates');
const mcpRoutes = require('./mcp');

module.exports = (deps) => {
  const router = express.Router();
  router.use(healthRoutes(deps));
  router.use(fileRoutes(deps));
  router.use(mediaRoutes(deps));
  router.use(filterRoutes(deps));
  router.use(audioRoutes(deps));
  router.use(ratesRoutes(deps));
  router.use(mcpRoutes(deps));
  return router;
};
