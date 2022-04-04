import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function StartIndex({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="StartIndex">
        <LabelTitle>Start Index</LabelTitle>
        <LabelText>NFT to start from</LabelText>
      </Label>
      <Input
        id="StartIndex"
        type="number"
        value={config.startIndex}
        onChange={(e) => setConfig((c) => ({ ...c, startIndex: parseInt(e.target.value) }))}
      />
    </InputGroup>
  )
}
