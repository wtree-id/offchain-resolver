#!/usr/bin/env bash

npx hardhat node > /dev/null &
sleep 5
npm run test:run
# the node ends up running in a different process, i didn't find a way to kill it
pkill -f hardhat
