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
const tonweb_1 = __importDefault(require("tonweb")); // should be on top
const tonweb_mnemonic_1 = require("tonweb-mnemonic");
const utils_1 = require("../utils");
const deployNft_1 = require("./deployNft");
const ensureCollectionBalance_1 = require("./ensureCollectionBalance");
const ensureCollection_1 = require("./ensureCollection");
const ensureDeployerBalance_1 = require("./ensureDeployerBalance");
const ensurePreviousNftExists_1 = require("./ensurePreviousNftExists");
class Deployer {
    constructor(config, nfts, log) {
        this.workInProgress = false;
        this.deployNft = deployNft_1.deployNft;
        this.ensureCollectionBalance = ensureCollectionBalance_1.ensureCollectionBalance;
        this.ensureDeployerBalance = ensureDeployerBalance_1.ensureDeployerBalance;
        this.ensureCollection = ensureCollection_1.ensureCollection;
        this.ensurePreviousNftExists = ensurePreviousNftExists_1.ensurePreviousNftExists;
        this.config = config;
        this.nfts = nfts;
        this.deployIndex = this.config.startIndex;
        this.mnemonic = config.walletMnemonic;
        const tonApiEndpoint = config.tonApiKey
            ? `${config.tonApiUrl}?api_key=${config.tonApiKey}`
            : config.tonApiUrl;
        this.tonweb = new tonweb_1.default(new tonweb_1.default.HttpProvider(tonApiEndpoint));
        this.log = log || console.log;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('[Deployer] STARTED');
            const words = this.mnemonic.split(' ');
            this.key = yield (0, tonweb_mnemonic_1.mnemonicToKeyPair)(words);
            const WalletClass = this.config.walletType === 'v4R2'
                ? this.tonweb.wallet.all.v4R2
                : this.config.walletType === 'v4R1'
                    ? this.tonweb.wallet.all.v4R1
                    : this.config.walletType === 'v3R2'
                        ? this.tonweb.wallet.all.v3R2
                        : this.config.walletType === 'v3R1'
                            ? this.tonweb.wallet.all.v3R1
                            : this.tonweb.wallet.all.v3R2;
            this.wallet = new WalletClass(this.tonweb.provider, {
                publicKey: this.key.publicKey,
                wc: 0,
            });
            const walletAddress = yield this.wallet.getAddress();
            const stringAddress = walletAddress.toString(true, true, true);
            if (this.config.walletAddress !== stringAddress) {
                this.log(`Config address: ${this.config.walletAddress}, Mnemonic address: ${stringAddress}, Config wallet type: ${this.config.walletType}`);
                throw new Error('[Deployer] Wallet address mismatch');
            }
            const collection = yield this.ensureCollection();
            collection.address = yield collection.getAddress();
            this.collection = collection;
            if (this.deployIndex === -1) {
                const collectionData = yield (0, utils_1.callTonApi)(() => collection.getCollectionData());
                if (collectionData.collectionContentUri === '') {
                    throw new Error("[Deployer] Start error, can't get collection start index");
                }
                this.deployIndex = collectionData.nextItemIndex;
            }
            if (this.nfts.length <= this.deployIndex) {
                throw new Error(`[Deployer] Start index ${this.deployIndex} bigger than supplied nfts amount ${this.nfts.length}, check nfts.csv`);
            }
            this.work();
            this.workInterval =
                typeof window !== 'undefined'
                    ? window.setInterval(() => {
                        this.work();
                    }, 1000)
                    : setInterval(() => {
                        this.work();
                    }, 1000);
        });
    }
    stop() {
        if (typeof this.workInterval === 'number') {
            window.clearTimeout(this.workInterval);
        }
        else {
            clearTimeout(this.workInterval);
        }
    }
    work() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.workInProgress) {
                return;
            }
            if (this.nfts.length <= this.deployIndex) {
                this.log(`[Deployer] Got no more nfts to deploy ${this.deployIndex}`);
                // process.exit(0)
                if (typeof this.workInterval === 'number') {
                    window.clearTimeout(this.workInterval);
                }
                else {
                    clearTimeout(this.workInterval);
                }
                return;
            }
            this.workInProgress = true;
            try {
                yield this.deployNft(this.collection);
            }
            catch (e) {
                this.log(`[Deployer] deployNft error ${e}`);
            }
            finally {
                this.workInProgress = false;
            }
        });
    }
    ensureSeqnoInc(seqno) {
        return __awaiter(this, void 0, void 0, function* () {
            let seqIncremented = false;
            for (let i = 0; i < 5; i++) {
                yield (0, utils_1.delay)(8000);
                const newSeqno = yield (0, utils_1.callTonApi)(this.wallet.methods.seqno().call);
                if (newSeqno === seqno + 1) {
                    seqIncremented = true;
                    break;
                }
            }
            if (!seqIncremented) {
                throw new Error('seq not incremented');
            }
        });
    }
}
exports.default = Deployer;
