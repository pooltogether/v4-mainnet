import { Contract } from '@ethersproject/contracts';
import { BigNumber, BigNumberish } from 'ethers';

export async function getMultiTicketAverageTotalSuppliesBetween(
  tickets: Array<Contract | undefined> | undefined,
  startTime?: BigNumberish,
  endTime?: BigNumberish
): Promise<BigNumber[] | undefined> {
  if (!tickets || !startTime || !endTime) return undefined;
  return await Promise.all(
    tickets.map(async contract => {
      if (!contract) return undefined;
      try {
        const tsv = await contract.getAverageTotalSuppliesBetween(
          [startTime],
          [endTime]
        );
        return tsv[0];
      } catch (error) {
        console.log('Error:', error);
        return;
      }
    })
  );
}

export default getMultiTicketAverageTotalSuppliesBetween;
