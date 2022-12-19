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
) {
  const regex = /V[1-9+]((.[0-9+]){0,2})$/g;
  const version = contractName.match(regex)?.[0]?.slice(1).split('.') || [1, 0, 0];
  const type = contractName.split(regex)[0];
  return {
    chainId,
    address: deploymentBlob.address,
    version: {
      major: Number(version[0]),
      minor: Number(version[1]) || 0,
      patch: Number(version[2]) || 0,
    },
    type,
    abi: deploymentBlob.abi,
    tags: [],
    extensions: {},
  };
}
