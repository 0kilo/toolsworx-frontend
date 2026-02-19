# GCP Functions Setup (Crypto + Currency Cache)

This folder contains a single HTTP Cloud Function (`ratesApi`) for:

- `POST /refresh` → refreshes cached data (crypto every 5 min, currency every 30 min)
- `GET /rates` → returns cached rates for your frontend
- `GET /health` → health check

## 1) Prerequisites

- Google Cloud project with billing enabled
- `gcloud` CLI installed and authenticated
- Node.js 22+

## 2) Configure project

```bash
gcloud auth login
gcloud config set project toolsworx-344a5
gcloud auth application-default login
```

## 3) Enable required APIs

```bash
gcloud services enable \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com
```

## 4) Create Firestore (Native mode)

Run once if not already created:

```bash
gcloud firestore databases create --location=us-central
```

## 5) Create secrets

Load values from `.env.example`:

```bash
set -a
source .env.example
set +a
```

```bash
printf '%s' "$COINGECKO_API_KEY" | gcloud secrets create coingecko-api-key --data-file=-
printf '%s' "$EXCHANGERATE_API_KEY" | gcloud secrets create exchangerate-api-key --data-file=-
printf '%s' "$REFRESH_TOKEN" | gcloud secrets create rates-refresh-token --data-file=-
```

If secrets already exist, add new versions:

```bash
printf '%s' "$COINGECKO_API_KEY" | gcloud secrets versions add coingecko-api-key --data-file=-
printf '%s' "$EXCHANGERATE_API_KEY" | gcloud secrets versions add exchangerate-api-key --data-file=-
printf '%s' "$REFRESH_TOKEN" | gcloud secrets versions add rates-refresh-token --data-file=-
```

## 6) Deploy function (2nd gen)

From this folder (`gcp-functions`):

```bash
gcloud functions deploy ratesApi \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-central1 \
  --source=. \
  --entry-point=ratesApi \
  --trigger-http \
  --allow-unauthenticated \
  --set-secrets=COINGECKO_API_KEY=coingecko-api-key:latest,EXCHANGERATE_API_KEY=exchangerate-api-key:latest,REFRESH_TOKEN=rates-refresh-token:latest
```

Get the function URL:

```bash
gcloud functions describe ratesApi --gen2 --region=us-central1 --format='value(serviceConfig.uri)'
```

### If deploy fails with "Permission denied on secret"

Grant Secret Manager access to the Cloud Run revision service account:

```bash
PROJECT_NUMBER=905466639122
RUNTIME_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

gcloud secrets add-iam-policy-binding coingecko-api-key \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding exchangerate-api-key \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding rates-refresh-token \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor"
```

Then redeploy:

```bash
gcloud functions deploy ratesApi \
  --gen2 \
  --runtime=nodejs22 \
  --region=us-central1 \
  --source=. \
  --entry-point=ratesApi \
  --trigger-http \
  --allow-unauthenticated \
  --set-secrets=COINGECKO_API_KEY=coingecko-api-key:latest,EXCHANGERATE_API_KEY=exchangerate-api-key:latest,REFRESH_TOKEN=rates-refresh-token:latest
```

### If deploy fails with "Secret ... was not found"

Check the active project and list secrets:

```bash
gcloud config get-value project
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud secrets list --format="value(name)"
```

If missing, create secrets from `.env.example`:

```bash
set -a
source .env.example
set +a

printf '%s' "$COINGECKO_API_KEY" | gcloud secrets create coingecko-api-key --replication-policy=automatic --data-file=-
printf '%s' "$EXCHANGERATE_API_KEY" | gcloud secrets create exchangerate-api-key --replication-policy=automatic --data-file=-
printf '%s' "$REFRESH_TOKEN" | gcloud secrets create rates-refresh-token --replication-policy=automatic --data-file=-
```

If secrets already exist, add fresh versions:

```bash
printf '%s' "$COINGECKO_API_KEY" | gcloud secrets versions add coingecko-api-key --data-file=-
printf '%s' "$EXCHANGERATE_API_KEY" | gcloud secrets versions add exchangerate-api-key --data-file=-
printf '%s' "$REFRESH_TOKEN" | gcloud secrets versions add rates-refresh-token --data-file=-
```

## 7) Create Scheduler job (every 5 minutes)

Replace `FUNCTION_URL` and `LONG_RANDOM_REFRESH_TOKEN`:

```bash
gcloud scheduler jobs create http rates-refresh-job \
  --location=us-central1 \
  --schedule='*/5 * * * *' \
  --uri='https://ratesapi-au6uaihfna-uc.a.run.app/refresh' \
  --http-method=POST \
  --headers='x-refresh-token=927265f5-9167-4d49-bad2-4888a95930d0'
```

Run immediately once:

```bash
gcloud scheduler jobs run rates-refresh-job --location=us-central1
```

## 8) Test endpoints

```bash
curl 'https://ratesapi-au6uaihfna-uc.a.run.app/health'
curl 'https://ratesapi-au6uaihfna-uc.a.run.app/rates'
curl -X POST 'https://ratesapi-au6uaihfna-uc.a.run.app/refresh' -H 'x-refresh-token: 927265f5-9167-4d49-bad2-4888a95930d0'
```

## 9) Connect frontend

Call:

- `GET FUNCTION_URL/rates`

and read:

- `crypto` (CoinGecko prices in USD)
- `currency` (ExchangeRate-API USD base payload)

## Notes

- Throttling is enforced server-side:
  - crypto refresh >= 5 minutes
  - currency refresh >= 30 minutes
- If refresh fails but old cache exists, old data is kept.
- Keep this function URL and refresh token outside source control.
