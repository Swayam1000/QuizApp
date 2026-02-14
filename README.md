# GeminiQuiz Live

Real-time host/player quiz app built with React + Vite + PeerJS.

## Local development

Prerequisites: Node.js 20+

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`
3. Open:
   `http://localhost:3000`

## Production build

`npm run build`

## Deploy to Google Cloud Run

This repo includes a production `Dockerfile` + `nginx.conf` to serve the Vite build.

### One-time setup

1. Set your project:
   `gcloud config set project <PROJECT_ID>`
2. Enable required APIs:
   `gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com`

### Build and deploy

Use source deploy (Cloud Build):

`gcloud run deploy geminiquiz-live --source . --region us-central1 --allow-unauthenticated --port 8080`

After deploy, Cloud Run prints the service URL. Use that URL as your host page.

## Notes for live sessions

- Host must wait until network is ready before starting (`Waiting for Network...` becomes `Start Quiz`).
- Player join links/QR are generated from the deployed service URL.
- All quiz media should be in `public/media` so it is bundled and served by Cloud Run.
