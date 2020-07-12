This guide is for those who would like to contribute to the code and work on the project. It will go over setup, developing, building and deploying

# Setup

1. Clone the repo from https://github.com/aumuaythai/aumt-website-frontend

2. Log in to consle.firebase.google.com with the AUMT gmail credentials. Select the AUMT Website project, navigating to Project Settings in the top left, then under General, find the Firebase SDK snippet. It should look something like:
```
const firebaseConfig = {
  apiKey: "<key>",
  authDomain: "<domain>",
  databaseURL: "<url>",
  projectId: "<id>",
  storageBucket: "<bucket>",
  messagingSenderId: "<id>",
  appId: "<id>",
  measurementId: "<id>"
};
```
3. Create two files called `.env.development` and `.env.production ` in the project root directory

4. Add the values from step 1 to the following environment variables in both files. Both files' contents should look like the below:
```
REACT_APP_FB_API_KEY=<key>

REACT_APP_FB_AUTH_DOMAIN=<domain>

REACT_APP_FB_DATABASE_URL=<url>

REACT_APP_FB_PROJECT_ID=<id>

REACT_APP_FB_STORAGE_BUCKET=<bucket>

REACT_APP_FB_MESSAGING_SENDER_ID=<id>

REACT_APP_FB_APP_ID=<id>

REACT_APP_FB_MEASUREMENT_ID=<id>
```

5. Append the following line to the `.env.production` file.

```
GENERATE_SOURCEMAP=false
```
6. Run `npm install` to install dependencies

# Develop

Run `npm start` to start the app in the development mode.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

# Build 

Run `npm run build` to build the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. You are now ready to deploy!


# Deploy

Install the [firebase CLI](https://firebase.google.com/docs/cli#install_the_firebase_cli) and authenticate.


Deploy by running `npm run deploy`. It will deploy whatever is in the build folder to firebase.
