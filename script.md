# Ton NFT Deployer

Deploys NFTs on TON Network.

## Initial server setup

* Node.js `^14`

## TON Wallet

Prepare TON wallet credentials (24 words) and make sure balance is high enough to process all NFTs. 
You need 0.07 TON for gas per NFT (if you want to deploy 10000 NFTs, you need around 700 TON). Minimum balance is 1 TON.

## Cloning repository
Clone this repository to your device
```
git clone https://github.com/tondiamonds/ton-nft-deployer
```

And run
```
npm install
```

## Set environment settings

Copy .env.example to .env, replace default values with yours.

- WALLET_MNEMONIC - mnemonic for your wallet (24 secure words), used to deploy collection and NFTs
- WALLET_TYPE - type of your wallet. v3R1, v3R2, v4R1, v4R2, other values will throw error
- WALLET_ADDRESS - Address of your wallet, it's used to check that you've supplied correct mnemonic and wallet type

- START_INDEX - Index of nft to start from. Starts from 0, leave it to 0 if you're not sure. If set to -1, will start from last nft on the blockchain.

- TON_API_URL - your ton api provider of choice. you can use toncenter.com. Replace https://toncenter.com/api/v2/jsonRPC with https://testnet.toncenter.com/api/v2/jsonRPC if you want to use testnet.
- TON_API_KEY - key for ton api, you can get it on your provider site, it's not recommended to deploy without api key.

### Collection deploy settings
- COLLECTION_ROYALTY - 0.1 - collection commission, 0.1 - 10%
- COLLECTION_CONTENT - url for your collection metadata, for exampe - http://yourcollection.com/collection.json
- COLLECTION_BASE - url for your collection api, nft urls are relative to it, for example - http://yourcollection.com/

- DEPLOY_AMOUNT - Amount of TONs to send to NFT collection on deploy. Should be around 0.02 * NFTs count.
- TOPUP_AMOUNT - Amount of TONs to send to NFT collection when it's balance goes below 0.5 TON. Used in case you used too little TONs on deploy.

## Adding nfts to deploy to database
Copy `nfts.csv.example` to `nfts.csv` and replace contents with desired nft params. Row format:
```
id,owner_address
```
OR
```
id
```

If nft has owner address - it will be minted with that owner, if not it will be minted with minter as owner.

Example:
```
0
1
2,EQCr1U4EVmSWpx2sunO1jhtHveatorjfDpttMCCkoa0JyD1P
```
This will create 3 NFTs. NFTs with index `0` and `1` will be owned by you wallet, while NFT with index `2` will be owned by `EQCr1U4EVmSWpx2sunO1jhtHveatorjfDpttMCCkoa0JyD1P`

NFT ids should be serial without gaps between them and start from 0. If you'll have NFTs list with gap, deployer will stop at first row after the gap, because before deploying nft it ensures that previous one was deployed successfully, except for NFT with index 0.

## Running server

After you made every step from above, run
```
npm run start
```

You should see `[Deployer] STARTED` message in your console. You should not use deployer wallet when script deploys NFTs, it can lead to undefined behaviour. Wallet should have enough tokens to deploy all contracts. If deployer balance goes below 1 TON it'll stop.
