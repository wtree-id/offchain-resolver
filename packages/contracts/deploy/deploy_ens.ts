import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployFunction: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const {
    deployments: { deploy },
    getNamedAccounts,
  } = hre
  const { deployer } = await getNamedAccounts()

  await deploy("ENSRegistry", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: true,
  })
}

deployFunction.tags = ["test"]

export default deployFunction
