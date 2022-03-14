import { Handler, schedule } from '@netlify/functions';
import { Context } from '@netlify/functions/dist/function/context';
import { Event } from '@netlify/functions/dist/function/event';
import { Response } from '@netlify/functions/dist/function/response';
import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import * as mailjet from 'node-mailjet';

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

  const mailer = mailjet.connect(
    process.env['MAILJET_API_KEY'] as string,
    process.env['MAILJET_SECRET_KEY'] as string
  );

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

  /*const request = await mailer
    .post('send', {'version': 'v3.1'})
    .request({
      Messages: [
        {
          From: {
            'Email': 'achain.jeremy@gmail.com',
            'Name': '[KitchenParty] Server'
          },
          To: [
            {
              'Email': 'achain.jeremy@gmail.com',
              'Name': 'Jérémy ACHAIN'
            }
          ],
          Subject: 'Backup',
          TextPart: [
            `${ recipes.length } recipes exported`
          ].join('\n'),
          Attachments: [
            {
              ContentType: 'application/json',
              Filename: 'recipes.json',
              Base64Content: Buffer.from(JSON.stringify(recipes)).toString('base64'),
            }
          ]
        }
      ]
    });*/

  console.log(`${ recipes.length } recipes exported`);

  return {
    statusCode: 200,
  };
};

const handler = schedule('@hourly', scheduleHandler);
export { handler };