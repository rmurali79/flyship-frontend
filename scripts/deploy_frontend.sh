#!/bin/bash
set -e

cd "$(dirname "$0")/.."

PROJECT_ID="peerpost-v2"
REGION="us-central1"
ARTIFACT_REPO="flyship-repo"

# Get the backend URL from the already-deployed backend service
BACKEND_URL=$(gcloud run services describe flyship-backend --region $REGION --project $PROJECT_ID --format="value(status.url)")

FRONTEND_IMG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/frontend:latest"

echo "======================================================"
echo " Building & Deploying Frontend to Cloud Run"
echo " Backend URL: $BACKEND_URL"
echo "======================================================"

echo "--> Building Frontend Image..."
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions="_REACT_APP_API_BASE=${BACKEND_URL},_IMAGE_TAG=${FRONTEND_IMG}" \
  --project $PROJECT_ID

echo "--> Deploying Frontend to Cloud Run..."
gcloud run deploy flyship-frontend \
    --image $FRONTEND_IMG \
    --region $REGION \
    --project $PROJECT_ID \
    --allow-unauthenticated

FRONTEND_URL=$(gcloud run services describe flyship-frontend --region $REGION --project $PROJECT_ID --format="value(status.url)")
echo "======================================================"
echo " Frontend Deployment Complete!"
echo " Frontend URL: $FRONTEND_URL"
echo "======================================================"
