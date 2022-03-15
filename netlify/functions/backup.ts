import { Handler, schedule } from '@netlify/functions';
import { Context } from '@netlify/functions/dist/function/context';
import { Event } from '@netlify/functions/dist/function/event';
import { Response } from '@netlify/functions/dist/function/response';
import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

config();

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

    const mailgun = new Mailgun(formData);
    const mailgunClient = mailgun.client({
      username: 'api',
      key: process.env['MAILGUN_API_KEY'] as string
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

    await mailgunClient.messages.create(process.env['MAILGUN_DOMAIN'] as string, {
      from: 'Kitchen Party <achain.jeremy@gmail.com>',
      to: [ 'achain.jeremy@gmail.com' ],
      subject: '[KitchenParty] Backup',
      text: [
        `${ recipes.length } recipes exported`
      ].join('\n'),
      attachment: [
        {
          filename: 'recipes.json',
          contentType: 'application/json',
          data: Buffer.from(JSON.stringify(recipes)),
        }
      ]
    });

    console.log(`${ recipes.length } recipes exported`);

    return {
      statusCode: 200,
    };
  }
;

const handler = schedule('@hourly', scheduleHandler);
export { handler };