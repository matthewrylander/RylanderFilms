# Firebase Hosting deployment

The site is built with Vite and deployed to Firebase Hosting by GitHub Actions whenever a commit is pushed to `main`. You can also start a deployment manually from the repository's **Actions** tab.

The workflow uses GitHub Actions OIDC and Google Cloud Workload Identity Federation. It does not use or require a downloadable service-account key, which is blocked by this project's organization policy.

## One-time Google Cloud setup

Run these commands with `gcloud` authenticated as an administrator of the `rylanderfilms` project. The project number is `945514403008`.

Enable the federation and Hosting APIs:

```sh
gcloud services enable iamcredentials.googleapis.com sts.googleapis.com firebasehosting.googleapis.com --project=rylanderfilms
```

Create the Workload Identity Pool and GitHub OIDC provider. The provider condition restricts impersonation to this repository:

```sh
gcloud iam workload-identity-pools create github-pool \
  --project=rylanderfilms \
  --location=global \
  --display-name="GitHub Actions"

gcloud iam workload-identity-pools providers create-oidc github-provider \
  --project=rylanderfilms \
  --location=global \
  --workload-identity-pool=github-pool \
  --display-name="RylanderFilms GitHub" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --attribute-condition="assertion.repository == 'matthewrylander/RylanderFilms'"
```

Allow that repository's GitHub Actions identity to impersonate the existing Firebase deployment service account, and grant that account Hosting deployment permissions:

```sh
gcloud iam service-accounts add-iam-policy-binding \
  firebase-adminsdk-fbsvc@rylanderfilms.iam.gserviceaccount.com \
  --project=rylanderfilms \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/945514403008/locations/global/workloadIdentityPools/github-pool/attribute.repository/matthewrylander/RylanderFilms"

gcloud projects add-iam-policy-binding rylanderfilms \
  --member="serviceAccount:firebase-adminsdk-fbsvc@rylanderfilms.iam.gserviceaccount.com" \
  --role=roles/firebasehosting.admin
```

Once configured, push a commit to `main` or manually run **Deploy to Firebase Hosting** in **Actions**. The workflow installs from `package-lock.json`, builds the site into `dist/`, authenticates through OIDC, and deploys Hosting to project `rylanderfilms`.

The workflow explicitly obtains an OAuth access token and verifies Google Cloud ADC before invoking Firebase CLI. If the verification step fails, check that the identity provider condition matches `matthewrylander/RylanderFilms` and that the `roles/iam.workloadIdentityUser` binding uses the same repository principal. If credential verification passes but deployment fails, confirm the service account has `roles/firebasehosting.admin` and that Firebase Hosting is enabled.

The Hosting configuration in `firebase.json` serves the Vite build from `dist/` and rewrites application routes to `index.html`. No Google Cloud service-account private key or GitHub credential secret is needed.
