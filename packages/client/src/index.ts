import { Command } from 'commander';
import { ethers } from 'ethers';

const program = new Command();
program
  .requiredOption('-r --registry <address>', 'ENS registry address')
  .option('-p --provider <url>', 'web3 provider URL', 'http://127.0.0.1:8545')
  .option('-i --chainId <chainId>', 'chainId', '31337')
  .option('-n --chainName <name>', 'chainName', 'hardhat')
  .argument('<name>');

program.parse(process.argv);
const options = program.opts();
const ensAddress = options.registry;
const chainId = parseInt(options.chainId);
const chainName = options.chainName;
const provider = new ethers.JsonRpcProvider(options.provider, {
  chainId,
  name: chainName,
  ensAddress,
});
(async () => {
  const name = program.args[0];
  const resolver = await provider.getResolver(name);
  if (resolver) {
    const ethAddress = await resolver.getAddress();
    const btcAddress = await resolver.getAddress(0);
    const content = await resolver.getContentHash();
    const email = await resolver.getText('email');
    console.log(`resolver address ${resolver.address}`);
    console.log(`eth address ${ethAddress}`);
    console.log(`btc address ${btcAddress}`);
    console.log(`content ${content}`);
    console.log(`email ${email}`);
  } else {
    console.log('no resolver found');
  }
})();
