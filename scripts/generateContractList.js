const fs = require("fs");

const mainnetDeployments = `${__dirname}/../deployments/mainnet`;
const polygonDeployments = `${__dirname}/../deployments/polygon`;

const networkDeploymentPaths = [mainnetDeployments, polygonDeployments];

const VERSION_ONE = {
  major: 1,
  minor: 0,
  patch: 0,
};

const contractList = {
  name: "Testnet Linked Prize Pool",
  version: VERSION_ONE,
  tags: {},
  contracts: [],
};

const formatContract = (chainId, contractName, deploymentBlob) => {
  return {
    chainId,
    address: deploymentBlob.address,
    version: VERSION_ONE,
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
