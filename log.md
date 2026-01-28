INFO 2026-01-28T04:40:24.997180Z [httpRequest.requestMethod: POST] [httpRequest.status: 202] [httpRequest.responseSize: 469 B] [httpRequest.latency: 24 ms] [httpRequest.userAgent: Chrome 143.0.0.0] https://unified-service-905466639122.us-east5.run.app/api/convert

ERROR 2026-01-28T04:40:25.007717Z ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users. See https://express-rate-limit.github.io/ERR_ERL_UNEXPECTED_X_FORWARDED_FOR/ for more information. at Object.xForwardedForHeader (/app/node_modules/express-rate-limit/dist/index.cjs:185:13) at wrappedValidations.<computed> [as xForwardedForHeader] (/app/node_modules/express-rate-limit/dist/index.cjs:397:22) at Object.keyGenerator (/app/node_modules/express-rate-limit/dist/index.cjs:658:20) at /app/node_modules/express-rate-limit/dist/index.cjs:710:32 at async /app/node_modules/express-rate-limit/dist/index.cjs:691:5 {


INFO 2026-01-28T04:42:40.281401Z [httpRequest.requestMethod: POST] [httpRequest.status: 202] [httpRequest.responseSize: 477 B] [httpRequest.latency: 30 ms] [httpRequest.userAgent: Chrome 143.0.0.0] https://unified-service-905466639122.us-east5.run.app/api/media/convert

DEFAULT 2026-01-28T04:42:40.313153Z {"file":"sample.png", "hostname":"localhost", "jobId":"2", "level":30, "msg":"Media conversion queued", "pid":1, "targetFormat":"png", "time":1.769575360313E12, "type":"media"}
  {
    "insertId": "697993c00004c74154ee50af",
    "jsonPayload": {
      "type": "media",
      "jobId": "2",
      "file": "sample.png",
      "pid": 1,
      "targetFormat": "png",
      "level": 30,
      "msg": "Media conversion queued",
      "hostname": "localhost",
      "time": 1769575360313
    },
    "resource": {
      "type": "cloud_run_revision",
      "labels": {
        "configuration_name": "unified-service",
        "location": "us-east5",
        "revision_name": "unified-service-00002-22z",
        "service_name": "unified-service",
        "project_id": "toolsworx-344a5"
      }
    },
    "timestamp": "2026-01-28T04:42:40.313153Z",
    "labels": {
      "instanceId": "005eb6974cbb263eb55c3b8fb0a60eb30fb7ea709b8233a63c89f1c6dfd90920caf9246733a7931c70adb1f6e3063f0c24e3c844990ff0c25f09f21f8ef6baa98830ab9859e0c9aaddea9a00"
    },
    "logName": "projects/toolsworx-344a5/logs/run.googleapis.com%2Fstdout",
    "receiveTimestamp": "2026-01-28T04:42:40.318970474Z"
  }
