#!/usr/bin/env bash

npx hardhat node > /dev/null & hardhat_pid=$!
sleep 5
npm run test:run

if [ ${hardhat_pid:-0} -gt 1 ]; then
    echo "Killing hardhat with PID ${hardhat_pid}"
    kill $hardhat_pid
fi