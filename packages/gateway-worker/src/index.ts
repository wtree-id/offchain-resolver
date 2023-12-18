import { ethers } from 'ethers';
import { json } from 'itty-router';
import { makeRouter } from './server';
import { JSONDatabase } from './json';

const routeHandler = (env: any) => {
  const { OFFCHAIN_STORE_DEV, OG_PRIVATE_KEY, OG_TTL, USE_TEST_DB } = env;
  const privateKey = OG_PRIVATE_KEY;
  const address = ethers.computeAddress(privateKey);
  const signer = new ethers.SigningKey(privateKey);
  let db = JSONDatabase.fromKVStore(OFFCHAIN_STORE_DEV, parseInt(OG_TTL));
  // I don't like this, but testing with KV is a pain
  if (USE_TEST_DB) {
    console.log('loading a test db');
    db = JSONDatabase.fromTestFile(parseInt(OG_TTL));
  }

  const router = makeRouter(signer, '/rpc/', db);
  console.log(`Serving with signing address ${address}`);
  return router;
};

export default {
  async fetch(request: Request, env: any, _context: any) {
    const router = routeHandler(env);
    return router.handle(request).then(json);
  },
};
