#!/usr/bin/env bash

ganache > /dev/null & ganache_pid=$!
sleep 5
npm run test:run

if [ ${ganache_pid:-0} -gt 1 ]; then
    echo "Killing ganache with PID ${ganache_pid}"
    kill $ganache_pid
fi

sleep 5