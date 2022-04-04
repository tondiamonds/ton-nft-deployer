# Creating an NFT collection in the TON main network

> ❤️ The instructions and tools were provided by the [TON Diamonds](https://ton.diamonds) - the first NFT project in TON.

If you are an NFT-collection author for TON but don't have good technical skills, you better wait until when NFT-marketplaces (like https://getgems.io) make their UI for creating collections.

The marketplaces are currently working on this functionality, creating a collection via the marketplace website will be as easy as posting a photo to social networks.

More advanced users can deploy now.

## Preparation.

1) Create a new wallet (for example, in [Tonkeeper](https://tonkeeper.com/) or https://wallet.ton.org).

   This wallet will manage the collection.

   Only by using this wallet you'll be able to create new NFT tokens for this collection or change the collection's metadata

2) When creating a wallet be sure to write down 24 English words for recovery.

   Be sure to save them in a safe place.
 
   If you lose them, you will permanently lose access to your wallet and collection management.

   No one but you should know your secret words.


3) Add the TON tokens to your wallet.

   You need about ~0.07 TON to create one NFT (for example, if you want to create 1000 NFT, you need about 70 TON).

4) Use a [webpage](https://tondiamonds.github.io/ton-nft-deployer/) or script to deploy.

## Web page.

* Open https://tondiamonds.github.io/ton-nft-deployer/.

* In `Wallet Mnemonic`, enter your 24 words with a space as delimiter between words (your words are used locally and they are not sent to third-party servers).

* In `Wallet Address`, enter your wallet address.

* In `Wallet Type`, enter the version of your wallet. If you just created it, most likely it's v3R2 or v4R2.

* If `Wallet Type` and `Wallet Address` don't match, the script won't run. In case of difficulties, you can find the version of your wallet by trying other options.

* At `Start Index` enter -1

* In `Ton Api Uri` enter https://toncenter.com/api/v2/jsonRPC

* In `Ton Api Key` enter your API key from https://toncenter.com (you can get it from the [bot](https://t.me/tonapibot) for free).

* In `Collection Royalty`, enter the expected percentage you want to get from reselling your NFT. This is set as a decimal. For instance, if you want 1% - then enter 0.01, if 15% - 0.15.

* In the `Collection content URL`, enter link to the collection metadata. This file must be hosted on your side. Later, if you need to, you can change this link in the smart contract.

* In the `Collection base URL`, enter the common path to your NFT metadata in JSON format. For instance, if you enter http://yourcollection.com/nft/ then
the first NFT metadata should be hosted at http://yourcollection.com/nft/0.json, the second at http://yourcollection.com/nft/1.json, etc.
These files should be hosted on your side.
You can change this path later on if you need to.

* In `Deploy Amount`, enter how many TON tokens you want to transfer from your wallet to the collection at the start. For each NFT you deploy ~0.02 TON fee will be charged from the collection contract, so if you deploy 1000 NFT you need around 20 TON.

* In `Topup Amount`, enter how many TON will be added to the collection if it runs out of balance. Recommended value is 1 TON.

* In `CSV to Deploy` upload a .csv file with the following format: `<number of NFT>,<wallet address of the owner of this NFT>`. If the NFT owner wallet address is empty, the NFT is going to be owned by the deployer.

   For example:
```
0,EQArpDCADpdZ23S8CeqmC-uvYX8PepLj9bW5I_FiVZP9s4ma
1,EQARz2mCJKlueMQNrbgNVnSC1vb8Jt3JBTxRievSnUYULpnv
2
```

   The structure of the list for NFT deployment has a strict order. The numbering starts from zero and must have no gaps (0, 1, 2, 3, etc).

* To begin the deployment press a `Start Deploy` button

The source code of the web page can be found in this repository.

## Check

* Open your wallet address at https://tonscan.org

* You will see outgoing transactions from your wallet to your collection address.

* Open https://tonscan.org/nft/<address_your_collection>. Verify that the displayed data is correct.

* You will see outgoing transactions from your collection - NFT deployments.

* Open https://tonscan.org/nft/<nft_address>. Check that the displayed data is correct.

## Script

This repository contains an open-source script in javascript to deploy the NFT collection.

The [script.md](https://github.com/tondiamonds/ton-nft-deployer/blob/main/script.md) describes how to run it.

The parameters of the .env are the same as those of the web page, so you can see the description of the parameters in the previous paragraph.

## NFT Deploy Basics

Your smart contracts must be compatible with the [NFT standard](https://github.com/ton-blockchain/TIPs/issues/62).

The contracts can be found at https://github.com/ton-blockchain/token-contract/tree/main/nft

`nft-collection-editable.fc` for a collection and `nft-item.fc` for a collection item.

The JavaScript SDK [TonWeb](https://github.com/toncenter/tonweb) version 0.0.38 and above (version is important) also uses these smart contracts.

The web page and script above use TonWeb.
