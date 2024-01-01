import { makeApp } from './server';
import { Command } from 'commander';
import { readFileSync } from 'fs';
import { ethers } from 'ethers';
import { JSONDatabase } from './json';
const program = new Command();
program
  .requiredOption('-k --private-key <key>', 'Private key to sign responses with. Prefix with @ to read from a file')
  .requiredOption('-d --data <file>', 'JSON file to read data from')
  .option('-t --ttl <number>', 'TTL for signatures', '300')
  .option('-p --port <number>', 'Port number to serve on', '8080');
program.parse(process.argv);
const options = program.opts();
let privateKey = options.privateKey;
if (privateKey.startsWith('@')) {
  privateKey = ethers.toBeArray(readFileSync(privateKey.slice(1), { encoding: 'utf-8' }));
}
const address = ethers.computeAddress(privateKey);
const signer = new ethers.SigningKey(privateKey);
const db = JSONDatabase.fromFilename(options.data, parseInt(options.ttl));
const app = makeApp(signer, '/', db);
console.log(`Serving on port ${options.port} with signing address ${address}`);
app.listen(parseInt(options.port));

module.exports = app;
