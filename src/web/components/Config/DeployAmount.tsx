import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function DeployAmount({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="DeployAmount">
        <LabelTitle>Deploy Amount</LabelTitle>
        <LabelText>
          Amount of TONs to send to NFT collection on deploy. Should be around 0.02 * NFTs count.
          <br></br>
          For example for 100 elements collection you should set 2 TONs
        </LabelText>
      </Label>
      <Input
        id="DeployAmount"
        type="text"
        value={config.deployAmount}
        onChange={(e) => setConfig((c) => ({ ...c, deployAmount: e.target.value }))}
      />
    </InputGroup>
  )
}
