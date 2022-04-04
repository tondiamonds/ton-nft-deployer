export interface Config {
  walletMnemonic: string
  walletType: string // 'v3R1' | 'v3R2' | 'v4R1' | 'v4R2'
  walletAddress: string

  startIndex: number

  tonApiUrl: string
  tonApiKey?: string

  collection: {
    royalty: number | string
    content: string
    base: string
  }

  deployAmount: string
  topupAmount: string
}

export class Nft {
  public id: number

  public collection_address?: string
  public owner_address?: string
  public content_uri?: string

  public seqno?: number
  public address?: string
}
