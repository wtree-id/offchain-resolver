import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployFunction: DeployFunction = async ({
  deployments,
  ethers,
}: HardhatRuntimeEnvironment) => {
  const signers = await ethers.getSigners()
  const owner = signers[0].address
  const registryDeploymentAddress = await deployments
    .getOrNull("ENSRegistry")
    .then((d) => d?.address)
  const resolverDeploymentAddress = await deployments
    .getOrNull("OffchainResolver")
    .then((d) => d?.address)
  if (!registryDeploymentAddress || !resolverDeploymentAddress) {
    throw new Error("ENSRegistry and OffchainResolver must be deployed")
  }

  const registry = await ethers.getContractAt("ENSRegistry", registryDeploymentAddress)
  const resolver = await ethers.getContractAt("OffchainResolver", resolverDeploymentAddress)

  await registry.setSubnodeOwner(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.id("eth"),
    owner,
    { from: owner }
  )
  await registry.setSubnodeOwner(ethers.namehash("eth"), ethers.id("test"), owner, {
    from: owner,
  })
  await registry.setResolver(ethers.namehash("test.eth"), await resolver.getAddress(), {
    from: owner,
  })
}
deployFunction.tags = ["test"]

export default deployFunction
