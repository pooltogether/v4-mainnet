
import fs from"fs";
import modulePackage from"../package.json";
import writeContractBlobToHistoryArchive from "./helpers/writeContractBlobToHistoryArchive";
import convertDeploymentsToContractList from "./helpers/convertDeploymentsToContractList";

const polygonDeployments = `${__dirname}/../deployments/polygon`;
const mainnetDeployments = `${__dirname}/../deployments/mainnet`;
const avalancheDeployments = `${__dirname}/../deployments/avalanche`;
const versionSplit = modulePackage.version.split(".");
const patchSplit = versionSplit[2].split("-");

const networkDeploymentPaths = [
  mainnetDeployments, 
  polygonDeployments, 
  avalancheDeployments
];

const PACKAGE_VERSION = {
  major: versionSplit[0],
  minor: versionSplit[1],
  patch: patchSplit[0],
}

const contractListDescription = {
  name: "PoolTogether V4 Mainnet",
  version: PACKAGE_VERSION,
  tags: {},
  contracts: [],
};
const contractsNew = convertDeploymentsToContractList(networkDeploymentPaths);
const contractList = {
  ...contractListDescription,
  contracts: contractsNew,
}
writeContractBlobToHistoryArchive(contractList);

fs.writeFile(
  `${__dirname}/../contracts.json`,
  JSON.stringify(contractList),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
