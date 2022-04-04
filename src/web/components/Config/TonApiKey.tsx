import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function TonApiKey({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="TonApiKey">
        <LabelTitle>Ton Api Key</LabelTitle>
        <LabelText>Key for ton api. Mandatory</LabelText>
      </Label>
      <Input
        id="TonApiKey"
        type="text"
        value={config.tonApiKey}
        onChange={(e) => setConfig((c) => ({ ...c, tonApiKey: e.target.value }))}
      />
    </InputGroup>
  )
}
