import { ethers } from 'ethers';
import { Contract } from 'ethers';
import { ContractsBlob } from '../types';
const debug = require('debug')('pt-autotask-lib');

export function getContract(
  name: string,
  chainId: number,
  providerOrSigner: any,
  contractsBlob: ContractsBlob
): Contract | undefined {
  debug('name:', name);
  debug('chainId:', chainId);
  if (!name || !chainId) throw new Error(`Invalid Contract Parameters`);
  const contract = contractsBlob.contracts.filter(
    cont => cont.type === name && cont.chainId === chainId
  );
  if (contract[0]) {
    return new ethers.Contract(
      contract[0].address,
      contract[0].abi,
      providerOrSigner
    );
  }
  throw new Error(`Contract Unavailable: ${name} on chainId: ${chainId} `);
}

export default getContract;
