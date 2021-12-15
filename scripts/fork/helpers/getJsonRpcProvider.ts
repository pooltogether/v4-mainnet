import { JsonRpcProvider } from '@ethersproject/providers';

export function getJsonRpcProvider(url: string): JsonRpcProvider {
  return new JsonRpcProvider(url);
}

export default getJsonRpcProvider;
