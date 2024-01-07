#!/usr/bin/env bash

npx wrangler dev --var USE_TEST_DB:true OG_PRIVATE_KEY:0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 & 
ganache > /dev/null & 
sleep 5
npm run test:run

# the node and the local dev server end up running in different processes, i didn't find a way to kill them
# wrangler has some issues with exiting the process, so i'm using pkill
pkill -f wrangler
pkill -f ganache