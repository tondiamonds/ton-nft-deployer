import TonWeb from 'tonweb' // should be on top
import { callTonApi, delay, isNftExists } from '../utils'
import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'

import Deployer from './index'

const { NftItem } = TonWeb.token.nft

// deployNft - Finds first nft with status 0, checks if it exists, if not deploys.
export async function deployNft(this: Deployer, nftCollection: NftCollectionType) {
  if (!nftCollection.address) {
    throw new Error('[Deployer] Corrupt nft collection')
  }

  const toDeploy = this.nfts[this.deployIndex]

  // Address that deploys everything should have tons
  await this.ensureDeployerBalance()
  // We need to make sure that nft collection has enough balance to create nft
  await this.ensureCollectionBalance(nftCollection)
  // Previous nft should be deployed, otherwise nft will not be created and we will get stuck seqno
  await this.ensurePreviousNftExists(nftCollection, toDeploy.id)

  this.log(`[Deployer] NFT deploy started ${toDeploy.id} ${toDeploy.owner_address || ''}`)

  // Check if nft exists
  const nftItemAddress = await callTonApi<
    ReturnType<typeof nftCollection.getNftItemAddressByIndex>
  >(() => nftCollection.getNftItemAddressByIndex(toDeploy.id))
  const nftItem = new NftItem(this.tonweb.provider, {
    address: nftItemAddress,
  })

  const exists = await isNftExists(this.tonweb, nftCollection, toDeploy.id)
  if (exists) {
    this.log(`[Deployer] NFT item already exists ${toDeploy.id}`)
    this.deployIndex++
    return
  }

  // 0.05 should be enough to deploy nft
  // eslint-disable-next-line prettier/prettier
  const amount = TonWeb.utils.toNano("0.05")
  const walletAddress = await this.wallet.getAddress()

  // If we have seqno in db, use it to rebroadcast tx
  const seqno = toDeploy.seqno ? toDeploy.seqno : await callTonApi(this.wallet.methods.seqno().call)

  // If we have no seqno from db and api - throw.
  // It can't be 0 since we already should've deployed collection
  if (typeof seqno !== 'number' || seqno === 0) {
    throw new Error('[Deployer] No seqno found')
  }

  // deploy nft
  await callTonApi(
    this.wallet.methods.transfer({
      secretKey: this.key.secretKey,
      toAddress: nftCollection.address,
      amount,
      seqno,
      payload: await nftCollection.createMintBody({
        amount,
        itemIndex: toDeploy.id,
        itemOwnerAddress: toDeploy.owner_address
          ? new TonWeb.utils.Address(toDeploy.owner_address)
          : walletAddress,
        itemContentUri: `${toDeploy.id}.json`,
      }),
      sendMode: 3,
    }).send
  )

  // If nft in db didn't have seqno - set it and retry deploy loop
  if (!toDeploy.seqno) {
    toDeploy.seqno = seqno
  }

  // Make sure that seqno increased from one we used
  await this.ensureSeqnoInc(seqno)

  // Wait to make sure blockchain updated and includes our nft
  await delay(8000)

  // Get new nft from blockchain
  const itemInfo = await callTonApi<ReturnType<typeof nftCollection.getNftItemContent>>(() =>
    nftCollection.getNftItemContent(nftItem)
  )

  if (!itemInfo) {
    throw new Error(`[Deployer] no nft item info ${toDeploy.id}`)
  }
  if (!itemInfo.ownerAddress) {
    throw itemInfo
  }

  this.deployIndex++
  this.log(`[Deployer] NFT deployed ${toDeploy.id}`)
}
