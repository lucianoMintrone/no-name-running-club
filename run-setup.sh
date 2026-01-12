#!/bin/bash
cd /workspaces/no-name-running-club
export $(cat .env | xargs)
npx tsx scripts/setup-challenges.ts > challenge-setup-output.log 2>&1
echo "Done - check challenge-setup-output.log"
