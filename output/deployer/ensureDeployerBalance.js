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
exports.ensureDeployerBalance = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const ONE_TON = new bn_js_1.default('1000000000');
// ensureDeployerBalance - ensures that deployer address has enough tons to deploy nft
function ensureDeployerBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        const address = yield this.wallet.getAddress();
        const sBalance = yield this.tonweb.getBalance(address);
        if (!sBalance || typeof sBalance !== 'string') {
            throw new Error('[Deployer] Balance error');
        }
        const balance = new bn_js_1.default(sBalance);
        const minBalance = new bn_js_1.default('1000000000'); // 1 ton
        if (balance.lt(minBalance)) {
            const currentBalance = balance.div(ONE_TON).toString();
            const currentAddress = address.toString(true, true, true);
            throw new Error(`[Deployer] Deployer balance insufficient (Min balance 1 TON). Current balance ${currentBalance}. Current wallet: ${currentAddress}`);
        }
    });
}
exports.ensureDeployerBalance = ensureDeployerBalance;
