import React, { useEffect, useState } from 'react'
import TonWeb from 'tonweb'
import { validateMnemonic, mnemonicToKeyPair } from 'tonweb-mnemonic'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function WalletAddress({ config }: { config: DeployConfig }) {
  const [currentAddress, setCurrentAddress] = useState('')

  useEffect(() => {
    ;(async function () {
      let newWalletAddress = ''

      try {
        const words = config.walletMnemonic.split(' ')
        const isValid = await validateMnemonic(words)
        if (isValid) {
          const key = await mnemonicToKeyPair(words)

          const WalletClass =
            config.walletType === 'v4R2'
              ? TonWeb.Wallets.all.v4R2
              : config.walletType === 'v4R1'
              ? TonWeb.Wallets.all.v4R1
              : config.walletType === 'v3R2'
              ? TonWeb.Wallets.all.v3R2
              : config.walletType === 'v3R1'
              ? TonWeb.Wallets.all.v3R1
              : TonWeb.Wallets.all.v3R2

          const wallet = new WalletClass(new TonWeb.HttpProvider(), {
            publicKey: key.publicKey,
            wc: 0,
          })
          const walletAddress = await wallet.getAddress()
          newWalletAddress = walletAddress.toString(true, true, true)
        }
      } catch (e) {
        // We couldn't get new address
      }

      setCurrentAddress(newWalletAddress)
    })()
  }, [config.walletMnemonic, config.walletType])

  return (
    <InputGroup>
      <Label htmlFor="walletaddress">
        <LabelTitle>Wallet Address</LabelTitle>
        <LabelText>Address of your wallet, to check if you supplied right seed phrase</LabelText>
      </Label>
      <Input id="walletaddress" type="text" value={currentAddress} />
    </InputGroup>
  )
}
