import React from 'react'

import { Config as DeployConfig } from '../../../models'

import { Input, InputGroup, Label, LabelText, LabelTitle } from './styled'

export function CollectionContent({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <InputGroup>
      <Label htmlFor="CollectionContent">
        <LabelTitle>Collection content URL</LabelTitle>
        <LabelText>Address of your collection metadata</LabelText>
      </Label>
      <Input
        id="CollectionContent"
        type="text"
        value={config.collection.content}
        onChange={(e) =>
          setConfig((c) => ({
            ...c,
            collection: { ...c.collection, content: e.target.value },
          }))
        }
      />
    </InputGroup>
  )
}
