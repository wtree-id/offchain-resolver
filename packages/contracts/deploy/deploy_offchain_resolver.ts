import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deploy: DeployFunction = async ({
  getNamedAccounts,
  deployments,
  network,
}: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments
  const { deployer, signer } = await getNamedAccounts()
  if (!network.config.gatewayurl) {
    throw "gatewayurl is missing on hardhat.config.js"
  }

  await deploy("OffchainResolver", {
    from: deployer,
    args: [network.config.gatewayurl, [signer]],
    log: true,
    deterministicDeployment: true,
  })
}

deploy.tags = ["test", "demo"]

export default deploy
