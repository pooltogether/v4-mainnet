const fs = require("fs");

function writeContractBlobToHistoryArchive(contractList: any) {
    fs.writeFileSync(
        `${__dirname}/../../history/mainnet.${contractList.version.major}.${contractList.version.minor}.${contractList.version.patch}.json`,
        JSON.stringify(contractList),
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
        }
    );
}

export default writeContractBlobToHistoryArchive