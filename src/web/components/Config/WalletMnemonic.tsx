import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function WalletMnemonic({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="walletmnemonic">
        <LabelTitle>Wallet Mnemonic</LabelTitle>
        <LabelText>24 words for deployer address</LabelText>
      </Label>
      <Input
        id="walletmnemonic"
        type="text"
        value={config.walletMnemonic}
        onChange={(e) => setConfig((c) => ({ ...c, walletMnemonic: e.target.value }))}
      />
    </InputGroup>
  )
}
