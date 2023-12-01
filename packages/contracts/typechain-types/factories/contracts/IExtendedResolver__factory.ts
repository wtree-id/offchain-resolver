/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IExtendedResolver,
  IExtendedResolverInterface,
} from "../../contracts/IExtendedResolver";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "name",
        type: "bytes",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "resolve",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IExtendedResolver__factory {
  static readonly abi = _abi;
  static createInterface(): IExtendedResolverInterface {
    return new Interface(_abi) as IExtendedResolverInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IExtendedResolver {
    return new Contract(address, _abi, runner) as unknown as IExtendedResolver;
  }
}
