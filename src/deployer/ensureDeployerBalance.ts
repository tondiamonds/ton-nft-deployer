import BN from 'bn.js'

import Deployer from './index'

const ONE_TON = new BN('1000000000')

// ensureDeployerBalance - ensures that deployer address has enough tons to deploy nft
export async function ensureDeployerBalance(this: Deployer) {
  const address = await this.wallet.getAddress()
  const sBalance = await this.tonweb.getBalance(address)

  if (!sBalance || typeof sBalance !== 'string') {
    throw new Error('[Deployer] Balance error')
  }

  const balance = new BN(sBalance)
  const minBalance = new BN('1000000000') // 1 ton

  if (balance.lt(minBalance)) {
    const currentBalance = balance.div(ONE_TON).toString()
    const currentAddress = address.toString(true, true, true)
    throw new Error(
      `[Deployer] Deployer balance insufficient (Min balance 1 TON). Current balance ${currentBalance}. Current wallet: ${currentAddress}`
    )
  }
}
