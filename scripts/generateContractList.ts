
import fs from"fs";
import modulePackage from"../package.json";
import writeContractBlobToHistoryArchive from "./helpers/writeContractBlobToHistoryArchive";
import convertDeploymentsToContractList from "./helpers/convertDeploymentsToContractList";
import CONTRACT_VERSIONS from '../CONTRACT_VERSIONS'
import diffOldAndNewContractList from "./helpers/diffOldAndNewContractList";

const polygonDeployments = `${__dirname}/../deployments/polygon`;
const mainnetDeployments = `${__dirname}/../deployments/mainnet`;
const avalancheDeployments = `${__dirname}/../deployments/avalanche`;
const versionSplit = modulePackage.version.split(".");

const networkDeploymentPaths = [
  mainnetDeployments, 
  polygonDeployments, 
  avalancheDeployments
];

const PACKAGE_VERSION = {
  major: versionSplit[0],
  minor: versionSplit[1],
  patch: versionSplit[2],
}

const contractList = {
  name: "PoolTogether V4 Mainnet",
  version: PACKAGE_VERSION,
  tags: {},
  contracts: [],
};

const mainnet = JSON.parse(fs.readFileSync(`${__dirname}/../mainnet.json`, "utf8"));
writeContractBlobToHistoryArchive(mainnet);
const contractListOld = mainnet.contracts;
const contractListNew = convertDeploymentsToContractList(networkDeploymentPaths);
const newContactsWithNextVersion  = diffOldAndNewContractList(contractListOld, contractListNew, CONTRACT_VERSIONS);
const contractListMerged = [...newContactsWithNextVersion, ...contractListOld];
writeContractBlobToHistoryArchive({
  ...contractList,
  contracts: contractListMerged,
});

// fs.writeFile(
//   `${__dirname}/../mainnet.json`,
//   JSON.stringify({
//     ...contractList,
//     contracts: contractListNew,
//   }),
//   (err) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//   }
// );
