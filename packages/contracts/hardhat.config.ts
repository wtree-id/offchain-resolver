import '@nomicfoundation/hardhat-toolbox';
import type { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-deploy';

let real_accounts: string[] = [];
if (process.env.DEPLOYER_KEY && process.env.OWNER_KEY) {
  real_accounts = [process.env.OWNER_KEY, process.env.DEPLOYER_KEY];
}
const gatewayurl = 'https://offchain-resolver-example.uc.r.appspot.com/{sender}/{data}.json';

let devgatewayurl = 'http://localhost:8080/{sender}/{data}.json';
if (process.env.REMOTE_GATEWAY) {
  devgatewayurl = `${process.env.REMOTE_GATEWAY}/{sender}/{data}.json`;
}
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const config: HardhatUserConfig = {
  solidity: '0.8.23',
  networks: {
    hardhat: {
      gatewayurl: devgatewayurl,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 3,
      accounts: real_accounts,
      gatewayurl,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 4,
      accounts: real_accounts,
      gatewayurl,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['test', 'demo'],
      chainId: 5,
      accounts: real_accounts,
      gatewayurl,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
      tags: ['demo'],
      chainId: 1,
      accounts: real_accounts,
      gatewayurl,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    signer: {
      default: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    },
    deployer: {
      default: 1,
    },
  },
};

export default config;
