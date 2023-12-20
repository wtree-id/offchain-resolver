#!/usr/bin/env bash

npx wrangler dev --var USE_TEST_DB:true OG_PRIVATE_KEY:0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 & wrangler_pid=$!
ganache > /dev/null & ganache_pid=$!
sleep 10
npm run test:run

if [ ${wrangler_pid:-0} -gt 1 ]; then
    echo "Killing wrangler with ${wrangler_pid}"
    kill -9 $wrangler_pid
fi

if [ ${ganache_pid:-0} -gt 1 ]; then
    echo "Killing ganache with ${ganache_pid}"
    kill $ganache_pid
fi

sleep 5