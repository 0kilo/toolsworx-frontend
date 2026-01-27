'use client'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
}

let auth: firebase.auth.Auth | null = null
let firestore: firebase.firestore.Firestore | null = null
const firebaseConfigReady = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
)

if (typeof window !== 'undefined' && firebaseConfigReady) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }
  auth = firebase.auth()
  firestore = firebase.firestore()
}

export { firebase, auth, firestore, firebaseConfigReady }
