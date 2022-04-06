import findNewContractAndBumpVersion from "./findNewContractAndBumpVersion";

function diffOldAndNewContractList(listOld, listNew, contractVersions) {
    const merge = [...listOld, ...listNew];
    const dif = merge.filter(a => {
    const matching = merge.filter((b, j) => b.address == a.address);
        if(matching.length > 1) {
            return false;
        } else {
            return true;
        }
    })

    const newContactsWithNextVersion = findNewContractAndBumpVersion(dif, contractVersions);

    return newContactsWithNextVersion;

}

export default diffOldAndNewContractList;