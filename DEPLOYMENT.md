# Firebase Hosting deployment

The site is built with Vite and deployed to Firebase Hosting by GitHub Actions whenever a commit is pushed to `main`. You can also start a deployment manually from the repository's **Actions** tab.

## One-time setup

1. Create a Firebase project in the [Firebase console](https://console.firebase.google.com/) and enable Firebase Hosting.
2. Use the deployment service account `firebase-adminsdk-fbsvc@rylanderfilms.iam.gserviceaccount.com`. Grant it the **Firebase Hosting Admin** role (`roles/firebasehosting.admin`), then create and download a JSON key for that account.
3. In the GitHub repository, open **Settings → Secrets and variables → Actions** and add this repository secret:
   - `FIREBASE_SERVICE_ACCOUNT`: the complete contents of the service account JSON key.
4. Push a commit to `main`, or run **Deploy to Firebase Hosting** manually from **Actions**.

The workflow targets the Firebase project `rylanderfilms`, installs from `package-lock.json`, builds the production site into `dist/`, and deploys that directory to the live Hosting channel. The service-account email alone cannot authenticate deployment; GitHub Actions needs its JSON key in the repository secret. Do not commit the key or add it to any client-side environment variables.

The Hosting configuration in `firebase.json` serves the Vite build and rewrites application routes to `index.html`.
