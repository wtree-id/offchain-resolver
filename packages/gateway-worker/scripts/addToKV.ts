/**
 * Simple script to write json file into Cloudflare KV Store
 */

import fs from 'fs';
import { spawn } from 'child_process';
import { Command } from 'commander';

const program = new Command();
program.requiredOption('-d --data <file>', 'JSON file to read data from');
program.parse(process.argv);
const options = program.opts();

const jsonDataPath = options.data;
const rawData = fs.readFileSync(jsonDataPath, { encoding: 'utf8' });

const putEntryToKVBash = spawn('wrangler', [
  'kv:key',
  'put',
  '--binding=OFFCHAIN_STORE_DEV',
  jsonDataPath,
  rawData,
  '--preview',
]);
putEntryToKVBash.stdout.on('data', (data: Buffer) => {
  console.log(data.toString());
});
putEntryToKVBash.stderr.on('data', (data: Buffer) => {
  console.error(data.toString());
});
putEntryToKVBash.stdout.on('exit', (data: Buffer) => {
  console.log(data.toString());
});
