const fs = require('fs');

import formatContractNew, { Version } from './formatContract';

export default function convertDeploymentsToContractList(networkDeploymentPaths: string[]) {
  let contractList = [];

  networkDeploymentPaths.forEach((networkDeploymentPath) => {
    const contractDeploymentPaths = fs
      .readdirSync(networkDeploymentPath)
      .filter((path) => path.endsWith('.json'));
    const chainId = Number(fs.readFileSync(`${networkDeploymentPath}/.chainId`, 'utf8'));

    contractDeploymentPaths.forEach((contractDeploymentFileName) => {
      const contractName = contractDeploymentFileName.split('.')[0];
      const contractDeployment = JSON.parse(
        fs.readFileSync(`${networkDeploymentPath}/${contractDeploymentFileName}`, 'utf8'),
      );

      contractList.push(formatContractNew(chainId, contractName, contractDeployment));
    });
  });

  return contractList;
}
