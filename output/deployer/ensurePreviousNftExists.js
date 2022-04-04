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
exports.ensurePreviousNftExists = void 0;
const tonweb_1 = __importDefault(require("tonweb")); // should be on top
const utils_1 = require("../utils");
const { NftItem } = tonweb_1.default.token.nft;
function ensurePreviousNftExists(nftCollection, nftId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (nftId < 0) {
            throw new Error('Wrong nftId');
        }
        // don't need to check first one
        if (nftId === 0) {
            return;
        }
        const id = nftId - 1;
        // Check if nft exists
        const nftItemAddress = yield (0, utils_1.callTonApi)(() => nftCollection.getNftItemAddressByIndex(id));
        const nftItem = new NftItem(this.tonweb.provider, {
            address: nftItemAddress,
        });
        const existingItemInfo = yield (0, utils_1.callTonApi)(() => nftCollection.getNftItemContent(nftItem));
        if (!existingItemInfo || !existingItemInfo.ownerAddress) {
            throw new Error('Nft not exists');
        }
        if (existingItemInfo.index !== id) {
            throw new Error('nft id error');
        }
    });
}
exports.ensurePreviousNftExists = ensurePreviousNftExists;
