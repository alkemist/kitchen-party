import { Handler, schedule } from '@netlify/functions';
import { Context } from '@netlify/functions/dist/function/context';
import { Event } from '@netlify/functions/dist/function/event';
import { Response } from '@netlify/functions/dist/function/response';
import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';

dotenv.config();

const scheduleHandler: Handler = async function (event: Event, context: Context): Promise<Response> {
  initializeApp({
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
    projectId: process.env['FIREBASE_PROJECT_ID'],
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
    appId: process.env['FIREBASE_APP_ID'],
    measurementId: process.env['FIREBASE_MEASUREMENT_ID']
  });

  const firestoreRef = getFirestore();

  async function select(collectionName: string): Promise<any[]> {
    const reference = collection(firestoreRef, collectionName);
    const docQuery = query(reference, orderBy('slug'));
    const querySnapshot = await getDocs(docQuery);

    const documents: any[] = [];
    querySnapshot.forEach((docSnapshot: any) => {
      documents.push(docSnapshot.data());
    });
    return documents;
  }

  const recipes = await select('recipe');
  console.log(`${ recipes.length } recipes exported`);

  return {
    statusCode: 200,
  };
};

const handler = schedule('@hourly', scheduleHandler);
export { handler };