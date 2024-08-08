import { ethers } from 'ethers';
import { makeRouter } from './server';
import { JSONDatabase } from './json';
import { ExportedHandler } from '@cloudflare/workers-types';
import { RouterType } from 'itty-router';

const routeHandler = (env: any): RouterType => {
  const { OG_PRIVATE_KEY, OG_TTL, USE_TEST_DB, OFFCHAIN_STORE_DEV } = env;
  const privateKey = OG_PRIVATE_KEY;
  const signer = new ethers.SigningKey(privateKey);
  const address = ethers.computeAddress(privateKey);
  let db
  // I don't like this, but testing with KV is a pain
  if (USE_TEST_DB) {
    db = JSONDatabase.fromTestFile(parseInt(OG_TTL));
  } else {
    db = JSONDatabase.fromKVStore(OFFCHAIN_STORE_DEV, parseInt(OG_TTL));
  }

  const router = makeRouter(signer, '/rpc/', db);
  console.log(`Serving with signing address ${address}`);
  return router;
};

export default {
  async fetch(request, env, ctx) {
    const router = routeHandler(env);
    return router.fetch(request, env, ctx)
  },
} satisfies ExportedHandler;
