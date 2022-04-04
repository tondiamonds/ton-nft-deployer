import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function WalletAddress({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="walletaddress">
        <LabelTitle>Wallet Address</LabelTitle>
        <LabelText>Address of your wallet, to check if you supplied right seed phrase</LabelText>
      </Label>
      <Input
        id="walletaddress"
        type="text"
        value={config.walletAddress}
        onChange={(e) => setConfig((c) => ({ ...c, walletAddress: e.target.value }))}
      />
    </InputGroup>
  )
}
