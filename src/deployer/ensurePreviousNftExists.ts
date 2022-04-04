import TonWeb from 'tonweb' // should be on top
import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'
import Deployer from '.'
import { callTonApi } from '../utils'

const { NftItem } = TonWeb.token.nft

export async function ensurePreviousNftExists(
  this: Deployer,
  nftCollection: NftCollectionType,
  nftId: number
) {
  if (nftId < 0) {
    throw new Error('Wrong nftId')
  }

  // don't need to check first one
  if (nftId === 0) {
    return
  }

  const id = nftId - 1

  // Check if nft exists
  const nftItemAddress = await callTonApi<
    ReturnType<typeof nftCollection.getNftItemAddressByIndex>
  >(() => nftCollection.getNftItemAddressByIndex(id))
  const nftItem = new NftItem(this.tonweb.provider, {
    address: nftItemAddress,
  })

  const existingItemInfo = await callTonApi<ReturnType<typeof nftCollection.getNftItemContent>>(
    () => nftCollection.getNftItemContent(nftItem)
  )

  if (!existingItemInfo || !existingItemInfo.ownerAddress) {
    throw new Error('Nft not exists')
  }

  if (existingItemInfo.index !== id) {
    throw new Error('nft id error')
  }
}
