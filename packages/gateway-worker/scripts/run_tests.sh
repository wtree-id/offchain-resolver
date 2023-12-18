#!/usr/bin/env bash

npx wrangler dev --var USE_TEST_DB:true & wrangler_pid=$!
npx ganache -D & ganache_pid=$!
sleep 5
npm run test

if [ ${wrangler_pid:-0} -gt 1 ]; then
    echo 'Killing wrangler with $wrangler_pid'
    kill -9 $wrangler_pid
fi

if [ ${ganache_pid:-0} -gt 1 ]; then
    echo 'Killing ganache with $ganache_pid'
    kill $ganache_pid
fi
