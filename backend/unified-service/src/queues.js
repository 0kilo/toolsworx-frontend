const Redis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const { REDIS_URL } = require('./config');

const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

const fileQueue = new Queue('file-conversion', { connection: redis });
const mediaQueue = new Queue('media-conversion', { connection: redis });
const filterQueue = new Queue('filter-processing', { connection: redis });
const audioFilterQueue = new Queue('audio-filter', { connection: redis });

module.exports = {
  redis,
  Queue,
  Worker,
  fileQueue,
  mediaQueue,
  filterQueue,
  audioFilterQueue,
};
