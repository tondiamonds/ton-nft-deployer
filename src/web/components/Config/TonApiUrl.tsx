import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function TonApiUrl({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="TonApiUrl">
        <LabelTitle>Ton Api Url</LabelTitle>
        <LabelText>
          Address of ton api.{' '}
          <a href="https://toncenter.com/api/v2/jsonRPC" target="_blank" rel="noopener noreferrer">
            https://toncenter.com/api/v2/jsonRPC
          </a>{' '}
          for mainnet,{' '}
          <a
            href="https://testnet.toncenter.com/api/v2/jsonRPC"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://testnet.toncenter.com/api/v2/jsonRPC
          </a>{' '}
          for testnet
        </LabelText>
      </Label>
      <Input
        id="TonApiUrl"
        type="text"
        value={config.tonApiUrl}
        onChange={(e) => setConfig((c) => ({ ...c, tonApiUrl: e.target.value }))}
      />
    </InputGroup>
  )
}
