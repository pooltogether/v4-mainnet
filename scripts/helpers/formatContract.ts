interface DeploymentBlob {
    address: string;
    abi: object;
}

function formatContract(chainId: number, contractName: string, deploymentBlob: DeploymentBlob) {
    return {
      chainId,
      address: deploymentBlob.address,
      version: undefined,
      type: contractName,
      abi: deploymentBlob.abi,
      tags: [],
      extensions: {},
    };
};

export default formatContract