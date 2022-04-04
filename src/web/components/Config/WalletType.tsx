import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { InputGroup, Label, LabelText, LabelTitle } from './styled'

export function WalletType({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="wallettype">
        <LabelTitle>Wallet Type</LabelTitle>
        <LabelText>Your wallet type</LabelText>
      </Label>
      <select
        id="wallettype"
        value={config.walletType}
        onChange={(e) => setConfig((c) => ({ ...c, walletType: e.target.value }))}
      >
        <option value="v3R1">v3R1</option>
        <option value="v3R2">v3R2</option>
        <option value="v4R1">v4R1</option>
        <option value="v4R2">v4R2</option>
      </select>
    </InputGroup>
  )
}
