import React from 'react'
import styled from 'styled-components'

import { Config as DeployConfig } from '../../../models'

import { WalletMnemonic } from './WalletMnemonic'
import { WalletType } from './WalletType'
import { WalletAddress } from './WalletAddress'
import { StartIndex } from './StartIndex'
import { TonApiUrl } from './TonApiUrl'
import { TonApiKey } from './TonApiKey'
import { CollectionRoyalty } from './CollectionRoyalty'
import { CollectionContent } from './CollectionContent'
import { CollectionBase } from './CollectionBase'
import { DeployAmount } from './DeployAmount'
import { TopupAmount } from './TopupAmount'

const FormContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
`

function Config({
  config,
  setConfig,
}: {
  config: DeployConfig
  setConfig: React.Dispatch<React.SetStateAction<DeployConfig>>
}) {
  return (
    <FormContainer>
      <WalletMnemonic config={config} setConfig={setConfig} />
      <WalletType config={config} setConfig={setConfig} />
      <WalletAddress config={config} setConfig={setConfig} />
      <StartIndex config={config} setConfig={setConfig} />
      <TonApiUrl config={config} setConfig={setConfig} />
      <TonApiKey config={config} setConfig={setConfig} />
      <CollectionRoyalty config={config} setConfig={setConfig} />
      <CollectionContent config={config} setConfig={setConfig} />
      <CollectionBase config={config} setConfig={setConfig} />
      <DeployAmount config={config} setConfig={setConfig} />
      <TopupAmount config={config} setConfig={setConfig} />
    </FormContainer>
  )
}

export { Config }
