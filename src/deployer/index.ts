import TonWeb from 'tonweb' // should be on top
import { KeyPair, mnemonicToKeyPair } from 'tonweb-mnemonic'
import { Config, Nft } from '../models'
import { callTonApi, delay } from '../utils'
import { deployNft } from './deployNft'
import { ensureCollectionBalance } from './ensureCollectionBalance'
import { ensureCollection } from './ensureCollection'
import { ensureDeployerBalance } from './ensureDeployerBalance'
import { ensurePreviousNftExists } from './ensurePreviousNftExists'
import { WalletContract } from 'tonweb/dist/types/contract/wallet/wallet-contract'
import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'

class Deployer {
  protected workInProgress = false
  protected config: Config
  protected nfts: Nft[]

  protected deployIndex: number
  protected collection: NftCollectionType

  protected tonweb: TonWeb

  protected mnemonic: string
  protected key: KeyPair
  protected wallet: WalletContract

  protected log: (log: string) => void
  protected workInterval: number | NodeJS.Timer

  constructor(config: Config, nfts: Nft[], log?: (log: string) => void) {
    this.config = config
    this.nfts = nfts

    this.deployIndex = this.config.startIndex

    this.mnemonic = config.walletMnemonic

    const tonApiEndpoint = config.tonApiKey
      ? `${config.tonApiUrl}?api_key=${config.tonApiKey}`
      : config.tonApiUrl
    this.tonweb = new TonWeb(new TonWeb.HttpProvider(tonApiEndpoint))

    this.log = log || console.log
  }

  async start() {
    this.log('[Deployer] STARTED')

    const words = this.mnemonic.split(' ')
    this.key = await mnemonicToKeyPair(words)

    const WalletClass =
      this.config.walletType === 'v4R2'
        ? this.tonweb.wallet.all.v4R2
        : this.config.walletType === 'v4R1'
        ? this.tonweb.wallet.all.v4R1
        : this.config.walletType === 'v3R2'
        ? this.tonweb.wallet.all.v3R2
        : this.config.walletType === 'v3R1'
        ? this.tonweb.wallet.all.v3R1
        : this.tonweb.wallet.all.v3R2

    this.wallet = new WalletClass(this.tonweb.provider, {
      publicKey: this.key.publicKey,
      wc: 0,
    })

    const walletAddress = await this.wallet.getAddress()
    const stringAddress = walletAddress.toString(true, true, true)

    if (this.config.walletAddress !== stringAddress) {
      this.log(
        `Config address: ${this.config.walletAddress}, Mnemonic address: ${stringAddress}, Config wallet type: ${this.config.walletType}`
      )
      throw new Error('[Deployer] Wallet address mismatch')
    }

    const collection = await this.ensureCollection()
    collection.address = await collection.getAddress()
    this.collection = collection

    if (this.deployIndex === -1) {
      const collectionData = await callTonApi<ReturnType<typeof collection.getCollectionData>>(() =>
        collection.getCollectionData()
      )

      if (collectionData.collectionContentUri === '') {
        throw new Error("[Deployer] Start error, can't get collection start index")
      }

      this.deployIndex = collectionData.nextItemIndex
    }

    if (this.nfts.length <= this.deployIndex) {
      throw new Error(
        `[Deployer] Start index ${this.deployIndex} bigger than supplied nfts amount ${this.nfts.length}, check nfts.csv`
      )
    }

    this.work()
    this.workInterval =
      typeof window !== 'undefined'
        ? window.setInterval(() => {
            this.work()
          }, 1000)
        : setInterval(() => {
            this.work()
          }, 1000)
  }

  stop() {
    if (typeof this.workInterval === 'number') {
      window.clearTimeout(this.workInterval)
    } else {
      clearTimeout(this.workInterval)
    }
  }

  async work() {
    if (this.workInProgress) {
      return
    }

    if (this.nfts.length <= this.deployIndex) {
      this.log(`[Deployer] Got no more nfts to deploy ${this.deployIndex}`)
      // process.exit(0)
      if (typeof this.workInterval === 'number') {
        window.clearTimeout(this.workInterval)
      } else {
        clearTimeout(this.workInterval)
      }
      return
    }

    this.workInProgress = true

    try {
      await this.deployNft(this.collection)
    } catch (e) {
      this.log(`[Deployer] deployNft error ${e}`)
    } finally {
      this.workInProgress = false
    }
  }

  protected deployNft = deployNft

  protected ensureCollectionBalance = ensureCollectionBalance

  protected ensureDeployerBalance = ensureDeployerBalance

  protected ensureCollection = ensureCollection

  protected ensurePreviousNftExists = ensurePreviousNftExists

  async ensureSeqnoInc(seqno: number) {
    let seqIncremented = false
    for (let i = 0; i < 5; i++) {
      await delay(8000)
      const newSeqno = await callTonApi(this.wallet.methods.seqno().call)
      if (newSeqno === seqno + 1) {
        seqIncremented = true
        break
      }
    }

    if (!seqIncremented) {
      throw new Error('seq not incremented')
    }
  }
}

export default Deployer
