import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyCzr4r3FJ6XrWgh6frbUpdWrfsqr8vEoyg',
  authDomain: 'rylanderfilms.firebaseapp.com',
  projectId: 'rylanderfilms',
  storageBucket: 'rylanderfilms.firebasestorage.app',
  messagingSenderId: '945514403008',
  appId: '1:945514403008:web:b7c3cce7900c90e2c70925',
  measurementId: 'G-XZ6X7TLJ3E',
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export async function initializeFirebaseAnalytics() {
  if (!(await isSupported())) return null
  return getAnalytics(firebaseApp)
}
