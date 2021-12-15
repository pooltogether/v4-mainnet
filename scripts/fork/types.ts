export interface ContractData {
    address: string;
    chainId: number;
    type: string;
    abi: any;
  }
  
export interface ContractsBlob {
  contracts: ContractData[];
}

export interface ProviderOptions {
    chainId: number;
    providerUrl: string;
}