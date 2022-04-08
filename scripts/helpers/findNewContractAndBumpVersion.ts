import getContractVersion from "./getContractVersion"

function findNewContractAndBumpVersion(contracts: Array<any>, contractVersions) {
    const newContract = contracts.filter(contract => typeof contract.version === 'undefined');
    const newContractWithNextVersion = newContract.map(contract => {
        return {
            ...contract,
            version: getContractVersion(contract.chainId, contract.type, contractVersions),
        }
    })

    return newContractWithNextVersion;
}


export default findNewContractAndBumpVersion;