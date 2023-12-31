/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "ENS",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ENS__factory>;
    getContractFactory(
      name: "ENSRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ENSRegistry__factory>;
    getContractFactory(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ECDSA__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "IExtendedResolver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IExtendedResolver__factory>;
    getContractFactory(
      name: "IResolverService",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IResolverService__factory>;
    getContractFactory(
      name: "OffchainResolver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OffchainResolver__factory>;

    getContractAt(
      name: "ENS",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ENS>;
    getContractAt(
      name: "ENSRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ENSRegistry>;
    getContractAt(
      name: "ECDSA",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ECDSA>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "IExtendedResolver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IExtendedResolver>;
    getContractAt(
      name: "IResolverService",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IResolverService>;
    getContractAt(
      name: "OffchainResolver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OffchainResolver>;

    deployContract(
      name: "ENS",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ENS>;
    deployContract(
      name: "ENSRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ENSRegistry>;
    deployContract(
      name: "ECDSA",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "IExtendedResolver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IExtendedResolver>;
    deployContract(
      name: "IResolverService",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IResolverService>;
    deployContract(
      name: "OffchainResolver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OffchainResolver>;

    deployContract(
      name: "ENS",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ENS>;
    deployContract(
      name: "ENSRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ENSRegistry>;
    deployContract(
      name: "ECDSA",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ECDSA>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "IExtendedResolver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IExtendedResolver>;
    deployContract(
      name: "IResolverService",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IResolverService>;
    deployContract(
      name: "OffchainResolver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OffchainResolver>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
