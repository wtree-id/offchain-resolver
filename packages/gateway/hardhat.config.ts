// This config is only needed to run the e2e tests. It is not used anywhere else in the gateway.
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-ethers';

const config: HardhatUserConfig = {
  solidity: '0.8.19',
};

export default config;
