import TonWeb from 'tonweb' // should be on top

import { NftCollection as NftCollectionType } from 'tonweb/dist/types/contract/token/nft/nft-collection'

const { NftItem } = TonWeb.token.nft

// Function to call ton api untill we get response.
// Because testnet is pretty unstable we need to make sure response is final
export async function callTonApi<T>(toCall: unknown, attempts = 20, delayMs = 100): Promise<T> {
  if (typeof toCall !== 'function') {
    throw new Error('unknown input')
  }

  let i = 0
  let lastError: unknown

  while (i < attempts) {
    try {
      const res = await toCall()
      return res
    } catch (err) {
      lastError = err
      i++
      await delay(delayMs)
    }
  }

  throw lastError
}

type ParseError = {
  result: {
    exit_code: number
  }
}

export async function isNftExists(
  tonweb: TonWeb,
  collection: NftCollectionType,
  index: number
): Promise<boolean> {
  const nftItemAddress = await callTonApi<ReturnType<typeof collection.getNftItemAddressByIndex>>(
    () => collection.getNftItemAddressByIndex(index)
  )
  const nftItem = new NftItem(tonweb.provider, {
    address: nftItemAddress,
  })

  let i = 0
  while (i < 20) {
    i++
    try {
      const res = await collection.getNftItemContent(nftItem)
      return res && res.index === index
    } catch (e) {
      const parseError = e as ParseError
      if (parseError && parseError.result && parseError.result.exit_code === -13) {
        return false
      }

      await delay(100)
    }
  }

  return false
}

export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve()
    }, ms)
  )
}
