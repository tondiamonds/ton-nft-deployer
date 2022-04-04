import TonWeb from 'tonweb'

import { Nft } from './models'

export function parseCsv(content: string): Nft[] {
  const rows = content.split('\n')
  if (rows.length < 1) {
    console.log('Not enough rows in nfts.csv')
    process.exit(1)
  }

  const nfts: Nft[] = []
  for (const row of rows) {
    const fields = row.split(',')
    if (fields.length !== 1 && fields.length !== 2) {
      throw new Error(`[Parse] Unknown csv fields length ${fields.length}`)
    }

    // First item should be number, second if exists - address
    const nftId = parseInt(fields[0])
    if (Number.isNaN(nftId) || nftId < 0) {
      throw new Error('[Parse] nftId < 0')
    }
    let owner
    if (fields.length === 2 && fields[1] && fields[1].length > 1) {
      if (!TonWeb.Address.isValid(fields[1])) {
        throw new Error(`[Parse] Owner address invalid ${fields[1]}`)
      }

      owner = fields[1]
    }

    nfts.push({
      id: nftId,
      owner_address: owner,
    })
  }

  return nfts
}
