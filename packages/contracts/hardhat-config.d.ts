import 'hardhat/types/config';

declare module 'hardhat/types/config' {
  interface HardhatNetworkUserConfig {
    gatewayurl?: string;
  }

  interface HttpNetworkUserConfig {
    gatewayurl?: string;
  }

  interface HardhatNetworkConfig {
    gatewayurl?: string;
  }

  interface HttpNetworkConfig {
    gatewayurl?: string;
  }
}
