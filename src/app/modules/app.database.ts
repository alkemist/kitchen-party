import {getAnalytics} from 'firebase/analytics';
import {initializeApp} from 'firebase/app';
import {environment} from '../../environments/environment';

const app = initializeApp({
  apiKey: environment.FIREBASE_API_KEY,
  authDomain: environment.FIREBASE_AUTH_DOMAIN,
  projectId: environment.FIREBASE_PROJECT_ID,
  storageBucket: environment.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: environment.FIREBASE_MESSAGING_SENDER_ID,
  appId: environment.FIREBASE_APP_ID,
  measurementId: environment.FIREBASE_MEASUREMENT_ID
});
if (environment.production) {
  getAnalytics(app);
}
