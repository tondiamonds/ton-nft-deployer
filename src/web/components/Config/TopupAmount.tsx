import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function TopupAmount({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="TopupAmount">
        <LabelTitle>Topup Amount</LabelTitle>
        <LabelText>
          Amount of TONs to send to NFT collection when it's balance goes below 0.5 TON. Used in
          case you used too little TONs on deploy.
        </LabelText>
      </Label>
      <Input
        id="TopupAmount"
        type="text"
        value={config.topupAmount}
        onChange={(e) => setConfig((c) => ({ ...c, topupAmount: e.target.value }))}
      />
    </InputGroup>
  )
}
