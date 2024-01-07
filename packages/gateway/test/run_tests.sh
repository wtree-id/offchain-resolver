#!/usr/bin/env bash

npx hardhat node > /dev/null &
sleep 5
npm run test:run
pkill -f hardhat
