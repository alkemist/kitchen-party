// @ts-ignore
const { writeFile } = require('fs');
//const { Firestore } = require('@google-cloud/firestore');
const firebase = require("firebase/app");
const firestore = require("firebase/firestore");

require('dotenv').config();

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const todayStr = `${ yyyy }-${ mm }-${ dd }`;

// @ts-ignore

// Create a new client
firebase.initializeApp({
  apiKey: process.env['FIREBASE_API_KEY'],
  authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
  projectId: process.env['FIREBASE_PROJECT_ID'],
  storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
  appId: process.env['FIREBASE_APP_ID'],
  measurementId: process.env['FIREBASE_MEASUREMENT_ID']
});

const firestoreRef = firestore.getFirestore();

async function select(collectionName: string): Promise<any[]> {
  const reference = firestore.collection(firestoreRef, collectionName);
  const query = firestore.query(reference, firestore.orderBy('slug'));
  const querySnapshot = await firestore.getDocs(query);

  const documents: any[] = [];
  querySnapshot.forEach((docSnapshot: any) => {
    documents.push(docSnapshot.data());
  });
  return documents;
}

async function backup(type: string) {
  const documents = await select(type);
  const targetPath = `./backups/backup-${ type }-${ todayStr }.json`;

  writeFile(targetPath, JSON.stringify(documents), (err: Error) => {
    if (err) {
      console.log(err);
    }
    console.log(`Wrote backup "${ type }" to ${ targetPath }`);
  });
}

backup('recipe');
backup('ingredient');






