import { red } from 'chalk';
import fs from 'fs';

import { ETHEREUM_MAINNET_CHAIN_ID } from '../../src/constants';

const deploymentFolderPath: { [key: number]: string } = {
  [ETHEREUM_MAINNET_CHAIN_ID]: 'deployments/mainnet',
};

export const getContractAddress = async (
  contractName: string,
  chainId: number,
): Promise<string> => {
  let address = '';

  const deploymentPath = `${__dirname.slice(0, __dirname.lastIndexOf('/scripts/'))}/${
    deploymentFolderPath[chainId]
  }`;

  await fs.promises
    .readdir(deploymentPath, { withFileTypes: true })
    .then(async (files) => {
      files.reverse();

      for (const file of files) {
        if (file.name.startsWith(contractName)) {
          const filePath = `${deploymentPath}/${file.name}`;

          await fs.promises.readFile(filePath).then((content) => {
            const data = JSON.parse(content.toString());

            address = data.address;
          });
        }
      }
    })
    .catch((error) => {
      red(`Failed to retrieve ${contractName} address.`);
      console.log(error);
    });

  return address;
};
