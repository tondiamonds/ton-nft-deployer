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
exports.delay = exports.isNftExists = exports.callTonApi = void 0;
const tonweb_1 = __importDefault(require("tonweb")); // should be on top
const { NftItem } = tonweb_1.default.token.nft;
// Function to call ton api untill we get response.
// Because testnet is pretty unstable we need to make sure response is final
function callTonApi(toCall, attempts = 20, delayMs = 100) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof toCall !== 'function') {
            throw new Error('unknown input');
        }
        let i = 0;
        let lastError;
        while (i < attempts) {
            try {
                const res = yield toCall();
                return res;
            }
            catch (err) {
                lastError = err;
                i++;
                yield delay(delayMs);
            }
        }
        throw lastError;
    });
}
exports.callTonApi = callTonApi;
function isNftExists(tonweb, collection, index) {
    return __awaiter(this, void 0, void 0, function* () {
        const nftItemAddress = yield callTonApi(() => collection.getNftItemAddressByIndex(index));
        const nftItem = new NftItem(tonweb.provider, {
            address: nftItemAddress,
        });
        let i = 0;
        while (i < 20) {
            i++;
            try {
                const res = yield collection.getNftItemContent(nftItem);
                return res && res.index === index;
            }
            catch (e) {
                const parseError = e;
                if (parseError && parseError.result && parseError.result.exit_code === -13) {
                    return false;
                }
                yield delay(100);
            }
        }
        return false;
    });
}
exports.isNftExists = isNftExists;
function delay(ms) {
    return new Promise((resolve) => setTimeout(() => {
        resolve();
    }, ms));
}
exports.delay = delay;
