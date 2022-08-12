import TonWeb from 'tonweb' // should be on top
import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'
import BN from 'bn.js'

import { callTonApi } from '../utils'
import Deployer from './index'

// ensureCollectionBalance - ensures that collection address has enough tons to deploy nft
export async function ensureCollectionBalance(this: Deployer, nftCollection: NftCollectionType) {
  const nftCollectionAddress = await nftCollection.getAddress()
  const sBalance = await this.tonweb.getBalance(nftCollectionAddress)

  if (!sBalance || typeof sBalance !== 'string') {
    throw new Error('[Deployer] Balance error')
  }

  const balance = new BN(sBalance)
  const minBalance = new BN('500000000') // 0.5 ton

  // Balance is ok, no need to topup
  if (balance.gt(minBalance)) {
    return
  }

  const seqno = await callTonApi(this.wallet.methods.seqno().call)
  if (typeof seqno !== 'number') {
    throw new Error('[Deployer] No seqno found')
  }

  await callTonApi(
    this.wallet.methods.transfer({
      secretKey: this.key.secretKey,
      toAddress: nftCollectionAddress.toString(true, true, true),
      amount: TonWeb.utils.toNano(this.config.topupAmount),
      seqno,
      payload: '', // body
      sendMode: 3,
    }).send
  )

  await this.ensureSeqnoInc(seqno)

  const newSBalance = await this.tonweb.getBalance(nftCollectionAddress)
  if (!newSBalance || typeof newSBalance !== 'string') {
    throw new Error('[Deployer] Cannot retrieve balance')
  }

  const newBalance = new BN(newSBalance)

  if (minBalance.gt(newBalance)) {
    throw new Error('[Deployer] Collection balance deposit error')
  }
}
