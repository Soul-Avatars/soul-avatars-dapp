export type Updater<T> = (updater: (value: T) => void) => void;

export interface NFT {
  id: number;
  tokenAddress: string;
  tokenId: string;
  amount: string;
  ownerOf: string;
  tokenHash: string;
  blockNumberMinted: string;
  blockNumber: string;
  contractType: string;
  name: string;
  symbol: string;
  metadata: string;
  minterAddress: string;
}
