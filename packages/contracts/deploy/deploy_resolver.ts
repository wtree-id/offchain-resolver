import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployFunction = async ({ deployments, ethers }: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments

  const signers = await ethers.getSigners()
  const owner = signers[0].address
  const registry = await ethers.getContract("ENSRegistry")
  const resolver = await ethers.getContract("OffchainResolver")

  await registry.setSubnodeOwner(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    ethers.id("eth"),
    owner,
    { from: owner }
  )
  await registry.setSubnodeOwner(ethers.namehash("eth"), ethers.id("test"), owner, {
    from: owner,
  })
  await registry.setResolver(ethers.namehash("test.eth"), resolver.address, { from: owner })
}
deployFunction.tags = ["test"]

export default deployFunction
