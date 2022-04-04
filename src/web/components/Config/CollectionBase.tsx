import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function CollectionBase({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="CollectionBase">
        <LabelTitle>Collection base URL</LabelTitle>
        <LabelText>Address of your collection base URL</LabelText>
      </Label>
      <Input
        id="CollectionBase"
        type="text"
        value={config.collection.base}
        onChange={(e) =>
          setConfig((c) => ({
            ...c,
            collection: { ...c.collection, base: e.target.value },
          }))
        }
      />
    </InputGroup>
  )
}
