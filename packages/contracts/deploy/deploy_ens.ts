import { DeployFunction } from 'hardhat-deploy/types';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy },
    ethers,
  } = hre;
  const signers = await ethers.getSigners();
  const owner = signers[0].address;
  await deploy('ENSRegistry', {
    from: owner,
    args: [],
    log: true,
  });
};

deployFunction.tags = ['test'];

export default deployFunction;
