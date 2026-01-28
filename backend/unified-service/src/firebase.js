const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

let appInstance;

function resolveServiceAccountPath() {
  const configured = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (configured) return path.resolve(process.cwd(), configured);
  return path.resolve(process.cwd(), '..', '..', '.env', 'toolsworx-344a5-firebase-adminsdk-fbsvc-adde63d253.json');
}

function initializeFirebase() {
  if (appInstance) return appInstance;

  const serviceAccountPath = resolveServiceAccountPath();
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    appInstance = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    appInstance = admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  }

  return appInstance;
}

function getFirestore() {
  if (!appInstance) initializeFirebase();
  return admin.firestore();
}

module.exports = { getFirestore };
