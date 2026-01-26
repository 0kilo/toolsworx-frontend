let jobCounter = 0;

class InMemoryJob {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.progress = 0;
    this._state = 'waiting';
    this.failedReason = undefined;
    this.returnvalue = undefined;
  }

  async updateProgress(value) {
    const next = Number(value);
    if (Number.isNaN(next)) return;
    this.progress = Math.max(0, Math.min(100, Math.round(next)));
  }

  async getState() {
    return this._state;
  }
}

class InMemoryQueue {
  constructor(name, processor) {
    this.name = name;
    this.processor = processor;
    this.jobs = new Map();
  }

  async add(_name, data) {
    const id = String(++jobCounter);
    const job = new InMemoryJob(id, data);
    this.jobs.set(id, job);
    setImmediate(() => this._run(job));
    return job;
  }

  async _run(job) {
    job._state = 'active';
    try {
      const result = await this.processor(job);
      job.returnvalue = result;
      job._state = 'completed';
    } catch (error) {
      job.failedReason = error?.message || String(error);
      job._state = 'failed';
    }
  }

  async getJob(id) {
    return this.jobs.get(id);
  }

  async close() {}
}

module.exports = { InMemoryQueue };
