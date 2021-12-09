import { PopulatedTransaction } from 'ethers';
import fs from 'fs'
import jsonfile from 'jsonfile';
export default async function saveUpgradePopulatedTransactions(populatedTransactions: PopulatedTransaction[], path: string) {
  const data = {
    transactions: populatedTransactions
  }

  jsonfile.writeFileSync(path, data, { flag: 'a' })

  return
}