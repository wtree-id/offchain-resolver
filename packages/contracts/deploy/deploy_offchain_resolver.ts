import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const deploy: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  network,
  ethers,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let contractDeployer = deployer;
  if (!contractDeployer && !network.tags.test) {
    throw new Error('deployer is not set');
  } else {
    const signers = await ethers.getSigners();
    contractDeployer = signers[0].address;
  }

  if (!network.config.gatewayurl) {
    throw new Error('gatewayurl is missing in hardhat config');
  }

  await deploy('OffchainResolver', {
    from: contractDeployer,
    args: [network.config.gatewayurl, [contractDeployer]],
    log: true,
    deterministicDeployment: true,
  });
};

deploy.tags = ['demo', 'test'];

export default deploy;
