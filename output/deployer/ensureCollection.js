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
exports.ensureCollection = void 0;
const tonweb_1 = __importDefault(require("tonweb")); // should be on top
const utils_1 = require("../utils");
const { NftItem, NftCollection } = tonweb_1.default.token.nft;
// ensureCollection - get collection. if we have one in db - return it
// if not - deploy new one
function ensureCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        // const collection = await tx<Collection>('collections').first()
        const walletAddress = yield this.wallet.getAddress();
        if (typeof this.config.collection.royalty !== 'number') {
            throw new Error('Wrong collection royalty');
        }
        const createCollectionParams = {
            ownerAddress: walletAddress,
            royalty: this.config.collection.royalty,
            royaltyAddress: walletAddress,
            collectionContentUri: this.config.collection.content,
            nftItemContentBaseUri: this.config.collection.base,
            nftItemCodeHex: NftItem.codeHex,
        };
        const nftCollection = new NftCollection(this.tonweb.provider, createCollectionParams);
        try {
            const collectionData = yield (0, utils_1.callTonApi)(() => nftCollection.getCollectionData());
            // If we collection is deployed - return it
            if (collectionData.collectionContentUri !== '') {
                return nftCollection;
            }
        }
        catch (e) { }
        // Address that deploys everything should have tons
        yield this.ensureDeployerBalance();
        this.log('[Deployer] Deploying new collection');
        const nftCollectionAddress = yield nftCollection.getAddress();
        let seqno = yield (0, utils_1.callTonApi)(this.wallet.methods.seqno().call);
        if (seqno === null) {
            seqno = 0;
        }
        if (typeof seqno !== 'number') {
            throw new Error('[Deployer] Blockchain issue. No seqno found');
        }
        // Deploy collection
        yield (0, utils_1.callTonApi)(() => __awaiter(this, void 0, void 0, function* () {
            return this.wallet.methods
                .transfer({
                secretKey: this.key.secretKey,
                toAddress: nftCollectionAddress.toString(true, true, false),
                amount: tonweb_1.default.utils.toNano(this.config.deployAmount),
                seqno: typeof seqno === 'number' ? seqno : 0,
                payload: '',
                sendMode: 3,
                stateInit: (yield nftCollection.createStateInit()).stateInit,
            })
                .send();
        }));
        // Make sure that seqno increased from one we used
        yield this.ensureSeqnoInc(seqno);
        try {
            const newData = yield (0, utils_1.callTonApi)(() => nftCollection.getCollectionData());
            if (newData.collectionContentUri === '') {
                throw new Error('[Deployer] Collection data after deploy not found');
            }
        }
        catch (e) {
            throw new Error('[Deployer] Collection data after deploy not found catch');
        }
        this.log('[Deployer] Collection deployed');
        return nftCollection;
    });
}
exports.ensureCollection = ensureCollection;
