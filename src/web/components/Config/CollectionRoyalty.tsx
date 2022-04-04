import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function CollectionRoyalty({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="CollectionRoyalty">
        <LabelTitle>Collection royalty</LabelTitle>
        <LabelText>Royalty for collection. 0.1 = 10%</LabelText>
      </Label>
      <Input
        id="CollectionRoyalty"
        type="number"
        value={config.collection.royalty}
        onChange={(e) => {
          const val = parseFloat(e.target.value)
          if (Number.isNaN(val)) {
            setConfig((c) => ({
              ...c,
              collection: { ...c.collection, royalty: e.target.value },
            }))
          }

          setConfig((c) => ({
            ...c,
            collection: { ...c.collection, royalty: parseFloat(e.target.value) },
          }))
        }}
      />
    </InputGroup>
  )
}
