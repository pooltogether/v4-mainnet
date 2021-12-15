import { BigNumber } from 'ethers';

function sumTwoBigNumbers(bn1: BigNumber, bn2: BigNumber): BigNumber {
  return bn1.add(bn2);
}

export function sumBigNumbers(numbers: BigNumber[]) {
  return numbers.reduce(sumTwoBigNumbers);
}
