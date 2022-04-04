import TonWeb from 'tonweb' // should be on top
import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'

import { callTonApi } from '../utils'
import Deployer from './index'

const { NftItem, NftCollection } = TonWeb.token.nft

// ensureCollection - get collection. if we have one in db - return it
// if not - deploy new one
export async function ensureCollection(this: Deployer): Promise<NftCollectionType> {
  // const collection = await tx<Collection>('collections').first()
  const walletAddress = await this.wallet.getAddress()

  if (typeof this.config.collection.royalty !== 'number') {
    throw new Error('Wrong collection royalty')
  }

  const createCollectionParams = {
    ownerAddress: walletAddress,
    royalty: this.config.collection.royalty,
    royaltyAddress: walletAddress,
    collectionContentUri: this.config.collection.content,
    nftItemContentBaseUri: this.config.collection.base,
    nftItemCodeHex: NftItem.codeHex,
  }

  const nftCollection = new NftCollection(this.tonweb.provider, createCollectionParams)

  try {
    const collectionData = await callTonApi<ReturnType<typeof nftCollection.getCollectionData>>(
      () => nftCollection.getCollectionData()
    )

    // If we collection is deployed - return it
    if (collectionData.collectionContentUri !== '') {
      return nftCollection
    }
  } catch (e) {}

  // Address that deploys everything should have tons
  await this.ensureDeployerBalance()

  this.log('[Deployer] Deploying new collection')
  const nftCollectionAddress = await nftCollection.getAddress()

  let seqno = await callTonApi(this.wallet.methods.seqno().call)

  if (seqno === null) {
    seqno = 0
  }
  if (typeof seqno !== 'number') {
    throw new Error('[Deployer] Blockchain issue. No seqno found')
  }

  // Deploy collection
  await callTonApi(async () =>
    this.wallet.methods
      .transfer({
        secretKey: this.key.secretKey,
        toAddress: nftCollectionAddress.toString(true, true, false), // non-bounceable
        amount: TonWeb.utils.toNano(this.config.deployAmount),
        seqno: typeof seqno === 'number' ? seqno : 0,
        payload: '', // body
        sendMode: 3,
        stateInit: (await nftCollection.createStateInit()).stateInit,
      })
      .send()
  )

  // Make sure that seqno increased from one we used
  await this.ensureSeqnoInc(seqno)

  try {
    const newData = await callTonApi<ReturnType<typeof nftCollection.getCollectionData>>(() =>
      nftCollection.getCollectionData()
    )

    if (newData.collectionContentUri === '') {
      throw new Error('[Deployer] Collection data after deploy not found')
    }
  } catch (e) {
    throw new Error('[Deployer] Collection data after deploy not found catch')
  }

  this.log('[Deployer] Collection deployed')

  return nftCollection
}
