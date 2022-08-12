"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployNft = void 0;
const tonweb_1 = __importDefault(require("tonweb")); // should be on top
const utils_1 = require("../utils");
const { NftItem } = tonweb_1.default.token.nft;
// deployNft - Finds first nft with status 0, checks if it exists, if not deploys.
function deployNft(nftCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!nftCollection.address) {
            throw new Error('[Deployer] Corrupt nft collection');
        }
        const toDeploy = this.nfts[this.deployIndex];
        // Address that deploys everything should have tons
        yield this.ensureDeployerBalance();
        // We need to make sure that nft collection has enough balance to create nft
        yield this.ensureCollectionBalance(nftCollection);
        // Previous nft should be deployed, otherwise nft will not be created and we will get stuck seqno
        yield this.ensurePreviousNftExists(nftCollection, toDeploy.id);
        this.log(`[Deployer] NFT deploy started ${toDeploy.id} ${toDeploy.owner_address || ''}`);
        // Check if nft exists
        const nftItemAddress = yield (0, utils_1.callTonApi)(() => nftCollection.getNftItemAddressByIndex(toDeploy.id));
        const nftItem = new NftItem(this.tonweb.provider, {
            address: nftItemAddress,
        });
        const exists = yield (0, utils_1.isNftExists)(this.tonweb, nftCollection, toDeploy.id);
        if (exists) {
            this.log(`[Deployer] NFT item already exists ${toDeploy.id}`);
            this.deployIndex++;
            return;
        }
        // 0.05 should be enough to deploy nft
        // eslint-disable-next-line prettier/prettier
        const amount = tonweb_1.default.utils.toNano("0.05");
        const walletAddress = yield this.wallet.getAddress();
        // If we have seqno in db, use it to rebroadcast tx
        const seqno = toDeploy.seqno ? toDeploy.seqno : yield (0, utils_1.callTonApi)(this.wallet.methods.seqno().call);
        // If we have no seqno from db and api - throw.
        // It can't be 0 since we already should've deployed collection
        if (typeof seqno !== 'number' || seqno === 0) {
            throw new Error('[Deployer] No seqno found');
        }
        // deploy nft
        yield (0, utils_1.callTonApi)(this.wallet.methods.transfer({
            secretKey: this.key.secretKey,
            toAddress: nftCollection.address,
            amount,
            seqno,
            payload: yield nftCollection.createMintBody({
                amount,
                itemIndex: toDeploy.id,
                itemOwnerAddress: toDeploy.owner_address
                    ? new tonweb_1.default.utils.Address(toDeploy.owner_address)
                    : walletAddress,
                itemContentUri: `${toDeploy.id}.json`,
            }),
            sendMode: 3,
        }).send);
        // If nft in db didn't have seqno - set it and retry deploy loop
        if (!toDeploy.seqno) {
            toDeploy.seqno = seqno;
        }
        // Make sure that seqno increased from one we used
        yield this.ensureSeqnoInc(seqno);
        // Wait to make sure blockchain updated and includes our nft
        yield (0, utils_1.delay)(8000);
        // Get new nft from blockchain
        const itemInfo = yield (0, utils_1.callTonApi)(() => nftCollection.getNftItemContent(nftItem));
        if (!itemInfo) {
            throw new Error(`[Deployer] no nft item info ${toDeploy.id}`);
        }
        if (!itemInfo.ownerAddress) {
            throw itemInfo;
        }
        this.deployIndex++;
        this.log(`[Deployer] NFT deployed ${toDeploy.id}`);
    });
}
exports.deployNft = deployNft;
