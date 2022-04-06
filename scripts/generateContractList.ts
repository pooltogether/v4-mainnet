
const fs = require("fs");
const _ = require("lodash");
const package = require("../package.json");
const mainnetDeployments = `${__dirname}/../deployments/mainnet`;
const polygonDeployments = `${__dirname}/../deployments/polygon`;
const avalancheDeployments = `${__dirname}/../deployments/avalanche`;

const networkDeploymentPaths = [mainnetDeployments, polygonDeployments, avalancheDeployments];

const VERSION = {
  major: 1,
  minor: 1,
  patch: 0,
};

const vsplit = package.version.split(".");
const PACKAGE_VERSION = {
  major: vsplit[0],
  minor: vsplit[1],
  patch: vsplit[2],
}

const contractList = {
  name: "PoolTogether V4 Mainnet",
  version: PACKAGE_VERSION,
  tags: {},
  contracts: [],
};

const formatContract = (chainId, contractName, deploymentBlob) => {
  return {
    chainId,
    address: deploymentBlob.address,
    version: PACKAGE_VERSION,
    type: contractName,
    abi: deploymentBlob.abi,
    tags: [],
    extensions: {},
  };
};

networkDeploymentPaths.forEach((networkDeploymentPath) => {
  const contractDeploymentPaths = fs
    .readdirSync(networkDeploymentPath)
    .filter((path) => path.endsWith(".json"));
  const chainId = Number(
    fs.readFileSync(`${networkDeploymentPath}/.chainId`, "utf8")
  );

  contractDeploymentPaths.forEach((contractDeploymentFileName) => {
    const contractName = contractDeploymentFileName.split(".")[0];
    const contractDeployment = JSON.parse(
      fs.readFileSync(
        `${networkDeploymentPath}/${contractDeploymentFileName}`,
        "utf8"
      )
    );
    contractList.contracts.push(
      formatContract(chainId, contractName, contractDeployment)
    );
  });
});

/* Existing Contract List ---- */
/* --------------------------- */
const mainnet = JSON.parse(fs.readFileSync(`${__dirname}/../mainnet.json`, "utf8"));
fs.writeFile(
  `${__dirname}/../history/mainnet.${mainnet.version.major}.${mainnet.version.minor}.${mainnet.version.patch}.json`,
  JSON.stringify(mainnet),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
  );
  
  /* Existing Contract List ---- */
  /* --------------------------- */
const mainnetPrevious = JSON.parse(fs.readFileSync(`${__dirname}/../history/mainnet.1.1.0.json`, "utf8"));
const mergedList = [...contractList.contracts, ...mainnetPrevious.contracts];
const reduced = mergedList.filter((a, i) => {
  const matching = mergedList.filter((b, j) => b.address == a.address);

  if(matching.length > 1) {
    for (let index = 0; index < matching.length; index++) {
      const element = matching[index];
      if(
        a.version.major < element.version.major || 
        (a.version.major == element.version.major && a.version.minor < element.version.minor) || 
        (a.version.major == element.version.major && a.version.minor == element.version.minor && a.version.patch < element.version.patch)) {
        return true;
      } else {
        return false;
      }
    }
  }
  return true;
})

fs.writeFile(
  `${__dirname}/../history/mainnet.${PACKAGE_VERSION.major}.${PACKAGE_VERSION.minor}.${PACKAGE_VERSION.patch}.json`,
  JSON.stringify(reduced),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);

fs.writeFile(
  `${__dirname}/../mainnet.json`,
  JSON.stringify(contractList),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
