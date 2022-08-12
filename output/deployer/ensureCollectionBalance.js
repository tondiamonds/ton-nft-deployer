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
exports.ensureCollectionBalance = void 0;
const tonweb_1 = __importDefault(require("tonweb")); // should be on top
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("../utils");
// ensureCollectionBalance - ensures that collection address has enough tons to deploy nft
function ensureCollectionBalance(nftCollection) {
    return __awaiter(this, void 0, void 0, function* () {
        const nftCollectionAddress = yield nftCollection.getAddress();
        const sBalance = yield this.tonweb.getBalance(nftCollectionAddress);
        if (!sBalance || typeof sBalance !== 'string') {
            throw new Error('[Deployer] Balance error');
        }
        const balance = new bn_js_1.default(sBalance);
        const minBalance = new bn_js_1.default('500000000'); // 0.5 ton
        // Balance is ok, no need to topup
        if (balance.gt(minBalance)) {
            return;
        }
        const seqno = yield (0, utils_1.callTonApi)(this.wallet.methods.seqno().call);
        if (typeof seqno !== 'number') {
            throw new Error('[Deployer] No seqno found');
        }
        yield (0, utils_1.callTonApi)(this.wallet.methods.transfer({
            secretKey: this.key.secretKey,
            toAddress: nftCollectionAddress.toString(true, true, true),
            amount: tonweb_1.default.utils.toNano(this.config.topupAmount),
            seqno,
            payload: '',
            sendMode: 3,
        }).send);
        yield this.ensureSeqnoInc(seqno);
        const newSBalance = yield this.tonweb.getBalance(nftCollectionAddress);
        if (!newSBalance || typeof newSBalance !== 'string') {
            throw new Error('[Deployer] Cannot retrieve balance');
        }
        const newBalance = new bn_js_1.default(newSBalance);
        if (minBalance.gt(newBalance)) {
            throw new Error('[Deployer] Collection balance deposit error');
        }
    });
}
exports.ensureCollectionBalance = ensureCollectionBalance;
