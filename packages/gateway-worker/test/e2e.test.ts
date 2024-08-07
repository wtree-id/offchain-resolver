import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ethers } from 'ethers';
import { ETH_COIN_TYPE } from '../src/utils';
import Resolver_abi from '@ensdomains/ens-contracts/artifacts/contracts/resolvers/Resolver.sol/Resolver.json';
import OffchainResolver_abi from '@wtree-id/offchain-resolver-contracts/artifacts/contracts/OffchainResolver.sol/OffchainResolver.json';

chai.use(chaiAsPromised);

const Resolver = new ethers.Interface(Resolver_abi.abi);

const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const TEST_URL = 'http://localhost:8000/rpc/{sender}/{data}.json';

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
      [ETH_COIN_TYPE]: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    },
    text: { email: 'test@example.com' },
    contenthash: '0xe40101fa011b20d1de9994b4d039f6548d191eb26786769f580809256b4685ef316805265ea162',
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
    resolver = (await deploySolidity(OffchainResolver_abi, signer, TEST_URL, [signerAddress])).connect(mockProvider);
    snapshot = await baseProvider.send('evm_snapshot', []);
  });

  afterEach(async () => {
    await baseProvider.send('evm_revert', [snapshot]);
  });

  describe('resolve()', () => {
    it.only('resolves calls to addr(bytes32)', async () => {
      const callData = Resolver.encodeFunctionData('addr(bytes32)', [ethers.namehash('test.eth')]);
      const result = await resolver.resolve(ethers.dnsEncode('test.eth'), callData, { enableCcipRead: true });
      const resultData = Resolver.decodeFunctionResult('addr(bytes32)', result);
      expect(resultData[0]).to.equal(ethers.getAddress(TEST_DB['test.eth'].addresses[ETH_COIN_TYPE]));
    });

    it('resolves calls to text(bytes32,string)', async () => {
      const callData = Resolver.encodeFunctionData('text(bytes32,string)', [ethers.namehash('test.eth'), 'email']);
      const result = await resolver.resolve(ethers.dnsEncode('test.eth'), callData, { enableCcipRead: true });
      const resultData = Resolver.decodeFunctionResult('text(bytes32,string)', result);
      expect(resultData[0]).to.equal(TEST_DB['test.eth'].text['email']);
    });
    it('resolves calls to contenthash(bytes32)', async () => {
      const callData = Resolver.encodeFunctionData('contenthash(bytes32)', [ethers.namehash('test.eth')]);
      const result = await resolver.resolve(ethers.dnsEncode('test.eth'), callData, { enableCcipRead: true });
      const resultData = Resolver.decodeFunctionResult('contenthash(bytes32)', result);
      expect(resultData[0]).to.equal(TEST_DB['test.eth'].contenthash);
    });
  });
});
