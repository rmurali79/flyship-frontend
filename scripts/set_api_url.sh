#!/bin/bash
# Usage: bash scripts/set_api_url.sh https://flyship-backend-xxxxx-uc.a.run.app

cd "$(dirname "$0")/.."

if [ -z "$1" ]; then
    echo "Usage: bash set_api_url.sh <BACKEND_URL>"
    echo "Example: bash set_api_url.sh https://flyship-backend-abc123-uc.a.run.app"
    exit 1
fi

URL="$1"
echo "Setting API base URL to: $URL"

sed -i '' "s|const API_BASE = .*|const API_BASE = process.env.REACT_APP_API_BASE || '$URL';|" src/config/api.js
echo "Updated src/config/api.js"

echo "Done! Restart the frontend dev server for changes to take effect."
