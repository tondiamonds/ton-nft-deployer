import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Config as DeployConfig, Nft } from '../models'
import { checkConfig } from '../config'
import { Config as FormConfig } from './components/Config'
import { Logs } from './components/Logs'
import NftInput from './components/Config/NftInput'

import Deployer from '../deployer'

const Container = styled.div`
  display: flex;
  max-width: 968px;
  margin: 0 auto;
  flex-direction: column;
`

const Title = styled.h1`
  color: var(--color-accent);
`

const DeployButton = styled.button`
  width: 100px;
  height: 32px;
  background-color: var(--color-highlight);
  color: var(--color-highlight-text);
  border: 0;
  outline: 0;
  border-radius: 4px;
  cursor: pointer;
  margin: 0.5rem 0;
`

const Description = styled.div``

function App() {
  const [init, setInit] = useState(false)
  const [config, setConfig] = useState<DeployConfig>({
    walletMnemonic: 'a b c d',
    walletType: 'v3R2',
    walletAddress: 'Address of your wallet',

    startIndex: -1,

    tonApiUrl: 'https://toncenter.com/api/v2/jsonRPC',
    tonApiKey: 'apikey',

    collection: {
      royalty: 0.1,
      content: 'http://yourcollection.com/collection.json',
      base: 'http://yourcollection.com/nft/',
    },

    deployAmount: '1',
    topupAmount: '1',
  })

  const [nfts, setNfts] = useState<Nft[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const [deployer, setDeployer] = useState<Deployer | null>(null)

  // On mount load nfts and config if exists
  useEffect(() => {
    setTimeout(() => setInit(true), 128)

    if (window.localStorage) {
      const deployConfig = window.localStorage.getItem('ton_nft_deploy_config')
      const deployNfts = window.localStorage.getItem('ton_nft_deploy_nfts')

      if (deployConfig) {
        const cnf = JSON.parse(deployConfig)
        if (cnf) {
          setConfig(cnf)
        }
      }

      if (deployNfts) {
        const nft = JSON.parse(deployNfts)
        if (nft) {
          setNfts(nft)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!init) {
      return
    }

    if (window.localStorage) {
      window.localStorage.setItem('ton_nft_deploy_config', JSON.stringify(config))
      window.localStorage.setItem('ton_nft_deploy_nfts', JSON.stringify(nfts))
    }
  }, [config, nfts])

  const addLog = (text: string) => {
    setLogs((logs) => [...logs, text])
  }

  const startDeploy = async () => {
    try {
      await checkConfig(config)
      const _deployer = new Deployer(config, nfts, addLog)
      await _deployer.start()
      setDeployer(_deployer)
    } catch (e) {
      addLog(`${e}`)
    }
  }

  const stopDeploy = async () => {
    if (deployer) {
      await deployer.stop()
      setDeployer(null)
      addLog('Deployer stopped')
    }
  }

  return (
    <Container>
      <Title>TON NFT Deployer</Title>
      <Description>This page will help you deploy your collection</Description>
      <Description>
        If you want to deploy big collection (1000+ elements), it's advised to use local(not web)
        version from{' '}
        <a
          href="https://github.com/tondiamonds/ton-nft-deployer"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/tondiamonds/ton-nft-deployer
        </a>
      </Description>

      <FormConfig config={config} setConfig={setConfig} />
      <NftInput nfts={nfts} setNfts={setNfts} addLog={addLog} />

      <DeployButton onClick={startDeploy}>Start deploy!</DeployButton>
      <DeployButton onClick={stopDeploy}>Stop deploy</DeployButton>

      <Logs logs={logs} />
    </Container>
  )
}

export default App
