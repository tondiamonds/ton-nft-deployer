import dotenv from 'dotenv'
import fs from 'fs'

import { getConfig } from './config'
import Deployer from './deployer'
import { parseCsv } from './parseCsv'

dotenv.config()
;(async function () {
  const config = await getConfig()

  const nftsString = fs.readFileSync('nfts.csv', { encoding: 'utf8' })
  const nfts = parseCsv(nftsString)

  const deployer = new Deployer(config, nfts)
  deployer.start()
})()
