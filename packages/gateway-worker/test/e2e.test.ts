/// <reference types="./ganache-cli" />
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { FetchResponse, JsonRpcProvider, ethers } from 'ethers';
import { JSONDatabase } from '../src/json';
import { makeServer } from '../src/server';
import { ETH_COIN_TYPE } from '../src/utils';
import Resolver_abi from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
import OffchainResolver_abi from '@wtree-id/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/OffchainResolver.json';
import { JsonRpcApiProvider } from 'ethers/src.ts/providers';

chai.use(chaiAsPromised);

const Resolver = new ethers.Interface(Resolver_abi.abi);

const TEST_PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const TEST_URL = 'http://localhost:8080/rpc/{sender}/{data}.json';

function deploySolidity(data: any, signer: ethers.Signer, ...args: any[]) {
  const factory = ethers.ContractFactory.fromSolidity(data, signer);
  return factory.deploy(...args);
}

const TEST_DB = {
  '*.eth': {
    addresses: {
      [ETH_COIN_TYPE]: '0x2345234523452345234523452345234523452345',
    },
    text: { email: 'wildcard@example.com' },
  },
  'test.eth': {
    addresses: {
      [ETH_COIN_TYPE]: '0x3456345634563456345634563456345634563456',
    },
    text: { email: 'test@example.com' },
    contenthash:
      '0xe40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
  },
};

describe('End to end test', () => {
  let resolver: ethers.Contract;
  let snapshot: number;
  let baseProvider: ethers.JsonRpcApiProvider;

  beforeAll(async () => {
    const key = new ethers.SigningKey(TEST_PRIVATE_KEY);
    baseProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545', 1337);
    const signer = await baseProvider.getSigner();
    const mockProvider = baseProvider;
    const signerAddress = ethers.computeAddress(key.privateKey);
    // @ts-expect-error fook it
    resolver = (
      await deploySolidity(OffchainResolver_abi, signer, TEST_URL, [
        signerAddress,
      ])
    ).connect(mockProvider);
    snapshot = await baseProvider.send('evm_snapshot', []);
    const db = new JSONDatabase(TEST_DB, 300);
    const server = makeServer(key, db);
    const app = server.makeApp('/rpc/');

    class CustomJsonRpcProvider extends ethers.JsonRpcProvider {
      async send(
        method: string,
        params: Array<any> | Record<string, any>
      ): Promise<any> {
        // All requests are over HTTP, so we can just start handling requests
        // We do this here rather than the constructor so that we don't send any
        // requests to the network (i.e. eth_chainId) until we absolutely have to.
        await this._start();
        console.log({ method, params });

        return await super.send(method, params);
      }
    }
  });

  afterEach(async () => {
    await baseProvider.send('evm_revert', [snapshot]);
  });

  describe('resolve()', () => {
    it('resolves calls to addr(bytes32)', async () => {
      const callData = Resolver.encodeFunctionData('addr(bytes32)', [
        ethers.namehash('test.eth'),
      ]);
      const result = await resolver.resolve(
        ethers.dnsEncode('test.eth'),
        callData
      );
      const resultData = Resolver.decodeFunctionResult('addr(bytes32)', result);
      expect(resultData).to.deep.equal([
        TEST_DB['test.eth'].addresses[ETH_COIN_TYPE],
      ]);
    });

    it('resolves calls to text(bytes32,string)', async () => {
      const callData = Resolver.encodeFunctionData('text(bytes32,string)', [
        ethers.namehash('test.eth'),
        'email',
      ]);
      const result = await resolver.resolve(
        ethers.dnsEncode('test.eth'),
        callData
      );
      const resultData = Resolver.decodeFunctionResult(
        'text(bytes32,string)',
        result
      );
      expect(resultData).to.deep.equal([TEST_DB['test.eth'].text['email']]);
    });
    it('resolves calls to contenthash(bytes32)', async () => {
      const callData = Resolver.encodeFunctionData('contenthash(bytes32)', [
        ethers.namehash('test.eth'),
      ]);
      const result = await resolver.resolve(
        ethers.dnsEncode('test.eth'),
        callData
      );
      const resultData = Resolver.decodeFunctionResult(
        'contenthash(bytes32)',
        result
      );
      expect(resultData).to.deep.equal([TEST_DB['test.eth'].contenthash]);
    });
  });
});
