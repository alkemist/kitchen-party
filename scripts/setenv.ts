const {writeFile} = require('fs');
const {argv} = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
  production: ${ isProduction },
  APP_NAME: "${ process.env['APP_NAME'] }",
  FIREBASE_API_KEY: "${ process.env['FIREBASE_API_KEY'] }",
  FIREBASE_AUTH_DOMAIN: "${ process.env['FIREBASE_AUTH_DOMAIN'] }",
  FIREBASE_PROJECT_ID: "${ process.env['FIREBASE_PROJECT_ID'] }",
  FIREBASE_STORAGE_BUCKET: "${ process.env['FIREBASE_STORAGE_BUCKET'] }",
  FIREBASE_MESSAGING_SENDER_ID: "${ process.env['FIREBASE_MESSAGING_SENDER_ID'] }",
  FIREBASE_APP_ID: "${ process.env['FIREBASE_APP_ID'] }",
  FIREBASE_MEASUREMENT_ID: "${ process.env['FIREBASE_MEASUREMENT_ID'] }",
  GOOGLE_CLOUD_OPERATIONS_API_KEY: "${ process.env['GOOGLE_CLOUD_OPERATIONS_API_KEY'] }",
};
`;
//
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: Error) {
  if (err) {
    console.log(err);
  }
  console.log(`Wrote variables to ${ targetPath }`);
});
