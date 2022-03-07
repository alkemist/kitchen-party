// @ts-ignore
const {writeFile} = require('fs');
const {Firestore} = require('@google-cloud/firestore');

// read environment variables from .env file
require('dotenv').config();

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const todayStr = `${ yyyy }-${ mm }-${ dd }`;

// @ts-ignore
const targetPath = `./backups/backup-${ todayStr }.json`;

// Create a new client
const firestore = new Firestore();

async function limitToLastQuery() {
  const collectionReference = firestore.collection('recipes');
  const recipeDocuments = await collectionReference
    .orderBy('slug')
    .limitToLast(2)
    .get();
  const recipeDocumentsData = recipeDocuments.docs.map((d: any) => d.data());
  recipeDocumentsData.forEach((doc: any) => {
    console.log(doc.name);
  });
}

limitToLastQuery().then(r => () => {
  console.log(r);

  writeFile(targetPath, '', (err: Error) => {
    if (err) {
      console.log(err);
    }
    console.log(`Wrote backup to ${ targetPath }`);
  });
});


