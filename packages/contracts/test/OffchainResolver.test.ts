import { ethers, deployments } from 'hardhat';
import { expect } from 'chai';
import { concat } from 'ethers';

const TEST_ADDRESS = '0xCAfEcAfeCAfECaFeCaFecaFecaFECafECafeCaFe';

const OFFCHAIN_RESOLVER_URL = 'http://localhost:8080/';

describe('OffchainResolver', () => {
  const setupTests = deployments.createFixture(async ({ deployments }) => {
    await deployments.fixture();
    const signingKey = new ethers.SigningKey(ethers.randomBytes(32));
    const signingAddress = ethers.computeAddress(signingKey);
    const signers = await ethers.getSigners();
    const resolverAddress = await (
      await ethers.getContractFactory('OffchainResolver')
    )
      .deploy(OFFCHAIN_RESOLVER_URL, [signingAddress])
      .then((tx) => tx.waitForDeployment())
      .then((tx) => tx.getAddress());
    const resolver = await ethers.getContractAt('OffchainResolver', resolverAddress);

    const name = 'test.eth';
    const expires = Math.floor(Date.now() / 1000 + 3600);
    // Encode the nested call to 'addr'
    const addrIface = new ethers.Interface(['function addr(bytes32) returns(address)']);
    const addrData = addrIface.encodeFunctionData('addr', [ethers.namehash('test.eth')]);

    // Encode the outer call to 'resolve'
    const callData = resolver.interface.encodeFunctionData('resolve', [ethers.dnsEncode('test.eth'), addrData]);

    // Encode the result data
    const resultData = addrIface.encodeFunctionResult('addr', [TEST_ADDRESS]);

    // Generate a signature hash for the response from the gateway
    const callDataHash = await resolver.makeSignatureHash(await resolver.getAddress(), expires, callData, resultData);

    // Sign it
    const sig = signingKey.sign(callDataHash);

    return {
      resolver,
      signers,
      signingAddress,
      signingKey,
      name,
      addrIface,
      sig,
      callData,
      expires,
      resultData,
    };
  });

  describe('supportsInterface()', async () => {
    it('supports known interfaces', async () => {
      const { resolver } = await setupTests();

      expect(await resolver.supportsInterface('0x9061b923')).to.equal(true); // IExtendedResolver
    });

    it('does not support a random interface', async () => {
      const { resolver } = await setupTests();
      expect(await resolver.supportsInterface('0x3b3b57df')).to.equal(false);
    });
  });

  describe('resolve()', async () => {
    it('returns a CCIP-read error', async () => {
      const { resolver } = await setupTests();

      await expect(resolver.resolve(ethers.dnsEncode('test.eth'), '0x')).to.be.revertedWithCustomError(
        resolver,
        'OffchainLookup',
      );
    });
  });

  describe('resolveWithProof()', async () => {
    it('resolves an address given a valid signature', async () => {
      const { resolver, callData, expires, resultData, sig, addrIface } = await setupTests();
      const encodedCallDataWithSigner = ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes', 'address'],
        [callData, await resolver.getAddress()],
      );

      // Generate the response data
      const response = ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes', 'uint64', 'bytes'],
        [resultData, expires, ethers.concat([sig.r, sig.s, `0x${sig.v.toString(16)}`])],
      );

      // Call the function with the request and response
      const [result] = addrIface.decodeFunctionResult(
        'addr',
        await resolver.resolveWithProof(response, encodedCallDataWithSigner),
      );
      expect(result).to.equal(TEST_ADDRESS);
    });

    it('reverts given an invalid signature', async () => {
      const { resolver, callData, expires, resultData, sig } = await setupTests();
      // Corrupt the sig
      const deadSig = ethers.toBeArray(ethers.concat([sig.r, sig.s, `0x${sig.v.toString(16)}`])).slice();
      deadSig[0] = deadSig[0] + 1;

      // Generate the response data
      const response = ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes', 'uint64', 'bytes'],
        [resultData, expires, deadSig],
      );

      // Call the function with the request and response
      await expect(resolver.resolveWithProof(response, callData)).to.be.reverted;
    });

    it('reverts given an expired signature', async () => {
      const { resolver, callData, resultData, sig } = await setupTests();
      // Generate the response data
      const response = ethers.AbiCoder.defaultAbiCoder().encode(
        ['bytes', 'uint64', 'bytes'],
        [resultData, Math.floor(Date.now() / 1000 - 1), concat([sig.r, sig.s, `0x${sig.v.toString(16)}`])],
      );

      // Call the function with the request and response
      await expect(resolver.resolveWithProof(response, callData)).to.be.reverted;
    });
  });
});
