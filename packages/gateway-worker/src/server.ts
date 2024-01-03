import { ethers, BytesLike, concat, Result } from 'ethers';
import { RouterType } from 'itty-router';
import { ETH_COIN_TYPE } from './utils';
import { abi as IResolverService_abi } from '@wtree-id/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/IResolverService.json';
import { abi as Resolver_abi } from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
import { Server } from './ccip-server-cf';

const ResolverInterface = new ethers.Interface(Resolver_abi);

interface DatabaseResult {
  result: any[];
  ttl: number;
}

type PromiseOrResult<T> = T | Promise<T>;

export interface Database {
  addr(name: string, coinType: number): PromiseOrResult<{ addr: string; ttl: number }>;
  text(name: string, key: string): PromiseOrResult<{ value: string; ttl: number }>;
  contenthash(name: string): PromiseOrResult<{ contenthash: string; ttl: number }>;
}

function decodeDnsName(dnsname: Uint8Array): string {
  const labels: string[] = [];
  let idx = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const len = dnsname[idx];

    if (len === 0) break;

    const labelBytes = dnsname.subarray(idx + 1, idx + len + 1);
    const label = String.fromCharCode.apply(null, Array.from(labelBytes));
    labels.push(label);

    idx += len + 1;
  }

  return labels.join('.');
}

const queryHandlers: {
  [key: string]: (db: Database, name: string, args: Result) => Promise<DatabaseResult>;
} = {
  'addr(bytes32)': async (db, name) => {
    const { addr, ttl } = await db.addr(name, ETH_COIN_TYPE);
    return { result: [addr], ttl };
  },
  'addr(bytes32,uint256)': async (db, name, args) => {
    const { addr, ttl } = await db.addr(name, args[0]);
    return { result: [addr], ttl };
  },
  'text(bytes32,string)': async (db, name, args) => {
    const { value, ttl } = await db.text(name, args[0]);
    return { result: [value], ttl };
  },
  'contenthash(bytes32)': async (db, name) => {
    const { contenthash, ttl } = await db.contenthash(name);
    return { result: [contenthash], ttl };
  },
};

async function query(db: Database, name: string, data: string): Promise<{ result: BytesLike; validUntil: number }> {
  // Parse the data nested inside the second argument to `resolve`
  const parsedTx = ResolverInterface.parseTransaction({ data });
  if (!parsedTx) {
    throw new Error('Invalid data');
  }
  const { signature, args } = parsedTx;

  if (ethers.ensNormalize(name) !== name) {
    throw new Error('Name must be normalised');
  }

  if (ethers.namehash(name) !== args[0]) {
    throw new Error('Name does not match namehash');
  }

  const handler = queryHandlers[signature];
  if (handler === undefined) {
    throw new Error(`Unsupported query function ${signature}`);
  }

  const { result, ttl } = await handler(db, name, args.slice(1));
  console.log('result, ttl', result, ttl);
  return {
    result: ResolverInterface.encodeFunctionResult(signature, result),
    validUntil: Math.floor(Date.now() / 1000 + ttl),
  };
}

export function makeServer(signer: ethers.SigningKey, db: Database | Promise<Database>) {
  const server = new Server();
  server.add(IResolverService_abi, [
    {
      type: 'resolve',
      func: async ([encodedName, data]: Result, request) => {
        const name = decodeDnsName(Buffer.from(encodedName.slice(2), 'hex'));
        // Query the database
        const { result, validUntil } = await query(await db, name, data);

        // Hash and sign the response
        const messageHash = ethers.solidityPackedKeccak256(
          ['bytes', 'address', 'uint64', 'bytes32', 'bytes32'],
          ['0x1900', request?.to, validUntil, ethers.keccak256(request?.data || '0x'), ethers.keccak256(result)],
        );
        const sig = signer.sign(messageHash);
        const sigData = concat([sig.r, sig.s, `0x${sig.v.toString(16)}`]);
        return [result, validUntil, sigData];
      },
    },
  ]);
  return server;
}

export function makeRouter(signer: ethers.SigningKey, path: string, db: Database | Promise<Database>): RouterType {
  return makeServer(signer, db).makeApp(path);
}
