interface DeploymentBlob {
  address: string;
  abi: object;
}

export type Version = {
  major: number;
  minor: number;
  patch: number;
};

export default function formatContract(
  chainId: number,
  contractName: string,
  deploymentBlob: DeploymentBlob,
  version: Version,
) {
  return {
    chainId,
    address: deploymentBlob.address,
    version,
    type: contractName,
    abi: deploymentBlob.abi,
    tags: [],
    extensions: {},
  };
}
