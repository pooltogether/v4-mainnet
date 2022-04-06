function getContractVersion(chainId: number, contractName: string, contractVersions: any) {
    const version = contractVersions[chainId][contractName];
    if (!version) {
        return {
            major: 1,
            minor: 0,
            patch: 0,
        }
    }
    return version;
}

export default getContractVersion