#!/usr/bin/env bash

npx ganache -D & ganache_pid=$!
sleep 10
npm run test:run

if [ ${ganache_pid:-0} -gt 1 ]; then
    echo 'Killing ganache with $ganache_pid'
    kill $ganache_pid
fi
